from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from email_utils import send_order_confirmation_email
from models import db, Users, Products, Orders, Payments, OrderItems, Cart, Comments, Likes
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from sqlalchemy import func, and_

app = Flask(__name__)  
bcrypt = Bcrypt(app)

class Recommendations(Resource):
    @jwt_required()
    def get(self):
        """Get personalized product recommendations"""
        user_id = int(get_jwt_identity())
        
        quiz_answers = request.args.get('quiz_answers')
        if quiz_answers:
            import json
            quiz_answers = json.loads(quiz_answers)
        
        recommended_products = []
        
        if quiz_answers and len(quiz_answers) == 3:
            quiz_recommendations = self.get_quiz_recommendations(quiz_answers)
            recommended_products.extend(quiz_recommendations)
        
        user_likes = Likes.query.filter_by(user_id=user_id).all()
        if user_likes:
            liked_recommendations = self.get_similar_products_from_likes(user_likes)
            recommended_products.extend(liked_recommendations)
        
        user_orders = Orders.query.filter_by(user_id=user_id).all()
        if user_orders:
            purchase_recommendations = self.get_purchase_based_recommendations(user_orders)
            recommended_products.extend(purchase_recommendations)
        
        seen_ids = set()
        unique_products = []
        for product in recommended_products:
            if product['id'] not in seen_ids:
                seen_ids.add(product['id'])
                unique_products.append(product)
        
        return unique_products[:8], 200
    
    def get_quiz_recommendations(self, quiz_answers):
        recipient = quiz_answers.get('0', '').lower()
        flavor = quiz_answers.get('1', '').lower()
        budget = quiz_answers.get('2', '')
        
        recommendations = []
        query = Products.query.filter_by(deleted_at=None)
        
        if 'sweet' in flavor or 'honey' in flavor:
            query = query.filter(
                (Products.name.ilike('%honey%')) |
                (Products.description.ilike('%sweet%')) |
                (Products.category == 'sweet')
            )
        elif 'spicy' in flavor or 'bold' in flavor:
            query = query.filter(
                (Products.name.ilike('%spicy%')) |
                (Products.name.ilike('%chili%')) |
                (Products.description.ilike('%spice%'))
            )
        elif 'chocolate' in flavor:
            query = query.filter(
                (Products.name.ilike('%chocolate%')) |
                (Products.name.ilike('%peanut butter cup%'))
            )
        
        budget_map = {
            'under $15': (0, 15),
            '$15-$25': (15, 25),
            '$25-$40': (25, 40),
            '$40+': (40, float('inf'))
        }
        if budget in budget_map:
            min_price, max_price = budget_map[budget]
            query = query.filter(Products.price >= min_price, Products.price <= max_price)
        
        products = query.limit(6).all()
        
        for product in products:
            recommendations.append(product.to_dict(include_comments=False))
        
        return recommendations
    
    def get_similar_products_from_likes(self, user_likes):
        liked_product_ids = [like.product_id for like in user_likes]
        
        liked_products = Products.query.filter(
            Products.id.in_(liked_product_ids),
            Products.deleted_at.is_(None)
        ).all()
        
        similar_products = []
        for liked in liked_products:
            similar = Products.query.filter(
                Products.deleted_at.is_(None),
                Products.id != liked.id,
                (
                    (Products.category == liked.category) |
                    (Products.collection == liked.collection)
                )
            ).limit(4).all()
            similar_products.extend(similar)
        
        return [p.to_dict(include_comments=False) for p in similar_products]
    
    def get_purchase_based_recommendations(self, user_orders):
        purchased_product_ids = []
        for order in user_orders:
            for item in order.items:
                purchased_product_ids.append(item.product_id)
        
        if not purchased_product_ids:
            return []
        
        order_ids = [order.id for order in user_orders]
        
        frequently_bought = db.session.query(OrderItems.product_id, func.count(OrderItems.product_id).label('count'))\
            .filter(OrderItems.order_id.in_(order_ids))\
            .filter(~OrderItems.product_id.in_(purchased_product_ids))\
            .group_by(OrderItems.product_id)\
            .order_by(func.count(OrderItems.product_id).desc())\
            .limit(8)\
            .all()
        
        product_ids = [pb[0] for pb in frequently_bought]
        products = Products.query.filter(Products.id.in_(product_ids)).all()
        
        return [p.to_dict(include_comments=False) for p in products]

class MeResource(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())

        user = Users.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404

        return {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'role': user.role
        }, 200

class User(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        
        if isinstance(current_user_id, dict):
            user_role = current_user_id.get('role')
            user_id = current_user_id.get('id')
        else:
            user_id = int(current_user_id) if current_user_id else None
            user = Users.query.get(user_id) if user_id else None
            user_role = user.role if user else None

        if user_role == 'admin':
            users = Users.query.filter_by(deleted_at=None).all()
            return [{
                'id': u.id,
                'name': u.name,
                'email': u.email,
                'phone': u.phone,
                'role': u.role
            } for u in users], 200

        user = Users.query.filter_by(id=user_id, deleted_at=None).first()
        if not user:
            return {'error': 'User not found'}, 404

        return {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'role': user.role
        }, 200

    @jwt_required()
    def patch(self):
        current_user_id = get_jwt_identity()
        
        if isinstance(current_user_id, dict):
            user_id = current_user_id.get('id')
        else:
            user_id = int(current_user_id) if current_user_id else None
        
        user = Users.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404

        data = request.get_json()
        new_name = data.get('name')
        new_email = data.get('email')
        new_phone = data.get('phone')
        new_password = data.get('new_password')
        current_password = data.get('current_password')

        try:
            if new_name and new_name.strip():
                user.name = new_name.strip()

            if new_email and new_email.strip() and new_email != user.email:
                existing_email = Users.query.filter(Users.email == new_email, Users.id != user.id).first()
                if existing_email:
                    return {'error': 'Email already in use'}, 400
                user.email = new_email.strip()

            if new_phone and new_phone.strip() and new_phone != user.phone:
                existing_phone = Users.query.filter(Users.phone == new_phone, Users.id != user.id).first()
                if existing_phone:
                    return {'error': 'Phone number already in use'}, 400
                user.phone = new_phone.strip()

            if new_password and isinstance(new_password, str) and new_password.strip():
                if not current_password:
                    return {'error': 'Current password is required to change password'}, 400
                
                if not user.password or not bcrypt.check_password_hash(user.password, current_password):
                    return {'error': 'Incorrect current password'}, 401

                user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')

            db.session.commit()
            return {'message': 'Profile updated successfully'}, 200

        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred: {str(e)}'}, 500
        
class Product(Resource):
    def get(self):
        query = Products.query.filter_by(deleted_at=None)

        collection = request.args.get('collection')
        category = request.args.get('category')

        if collection:
            query = query.filter(Products.collection == collection)
        if category:
            query = query.filter(Products.category == category)

        products = query.all()
        return [p.to_dict(include_comments=False) for p in products], 200
    
    @jwt_required()
    def post(self):
        print("=== PRODUCT CREATE DEBUG ===")
        
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id) if isinstance(current_user_id, (int, str)) else None
        
        claims = get_jwt()
        user_role = claims.get('role')

        if user_role != 'admin':
            print(f"Access denied. User role: {user_role}")
            return {'error': 'The user is forbidden from adding new products!'}, 403

        data = request.get_json()
        
        required_fields = {'name', 'description', 'price', 'image'}
        if not data or not all(key in data for key in required_fields):
            return {'error': 'Missing required fields!'}, 422

        name = data['name'].strip()
        description = data['description'].strip()
        
        try:
            price = float(data['price'])
        except (ValueError, TypeError):
            return {'error': 'Price must be a valid number'}, 400

        if price <= 0:
            return {'error': 'Price must be greater than zero'}, 400

        existing_product = Products.query.filter_by(name=name).filter(Products.deleted_at == None).first()
        if existing_product:
            return {'error': 'A product with this name already exists'}, 400

        try:
            stock = int(data.get('stock', 0))
        except (ValueError, TypeError):
            stock = 0
            
        if stock < 0:
            return {'error': 'Stock cannot be negative'}, 400

        new_product = Products(
            name=name,
            description=description,
            price=price,
            image=data['image'],
            stock=stock,
            collection=data.get('collection'),
            category=data.get('category'),
        )
        
        db.session.add(new_product)
        db.session.commit()
        
        return new_product.to_dict(include_comments=False), 201
    
class ProductResource(Resource):
    def get(self, product_id):
        product = Products.query.filter_by(id=product_id, deleted_at=None).first()
        if not product:
            return {'error': 'Product not found'}, 404
        return {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'image': product.image,
            'stock': product.stock
        }, 200
    
    @jwt_required()
    def patch(self, product_id):
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id) if isinstance(current_user_id, (int, str)) else None
        
        claims = get_jwt()
        user_role = claims.get('role')

        if user_role != 'admin':
            return {'error': 'Only admins can update products!'}, 403

        product = Products.query.get(product_id)
        if not product:
            return {'error': 'Product not found!'}, 404

        data = request.get_json()

        if 'name' in data:
            product.name = data['name'].strip()

        if 'collection' in data:
            product.collection = data['collection'] or None

        if 'category' in data:
            product.category = data['category'] or None

        if 'description' in data:
            product.description = data['description'].strip()

        if 'price' in data:
            try:
                price = float(data['price'])
                if price <= 0:
                    return {'error': 'Price must be greater than zero!'}, 400
                product.price = price
            except ValueError:
                return {'error': 'Price must be a valid number!'}, 400

        if 'image' in data:
            product.image = data['image']

        if 'stock' in data:
            try:
                stock = int(data['stock'])
                if stock < 0:
                    return {'error': 'Stock cannot be negative!'}, 400
                product.stock += stock
            except ValueError:
                return {'error': 'Stock must be an integer!'}, 400

        db.session.commit()
        return product.to_dict(include_comments=False), 200

    @jwt_required()
    def delete(self, product_id):
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id) if isinstance(current_user_id, (int, str)) else None
        
        claims = get_jwt()
        user_role = claims.get('role')
        
        if user_role != 'admin':
            return {'error': 'Only admins can delete products!'}, 403
        
        product = Products.query.get(product_id)
        if not product:
            return {'error': 'Product not found!'}, 404
        
        product.deleted_at = datetime.utcnow()
        db.session.commit()
        
        return {'message': 'Product soft deleted successfully!'}, 200

class Order(Resource):
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id) if isinstance(current_user_id, (int, str)) else None

        if not user_id:
            return {'error': 'Unauthorized. Please log in to place an order.'}, 401

        data = request.get_json()
        if not data or 'items' not in data:
            return {'error': 'Missing required fields!'}, 422

        items = data['items']
        if not isinstance(items, list) or len(items) == 0:
            return {'error': 'At least one product must be included in the order.'}, 400

        total_price = 0
        order_items = []
        product_updates = []

        for item in items:
            product_id = item.get('product_id')
            quantity = item.get('quantity')

            if not product_id or not quantity:
                return {'error': 'Each item must include product_id and quantity'}, 400

            if quantity <= 0:
                return {'error': 'Quantity must be at least 1'}, 400

            product = Products.query.get(product_id)
            if not product:
                return {'error': f'Product with ID {product_id} not found'}, 404

            if product.stock < quantity:
                return {'error': f'Insufficient stock for product {product.name}'}, 400

            total_price += product.price * quantity

            order_items.append(OrderItems(product_id=product_id, quantity=quantity, order_id=None))  
            product_updates.append((product, quantity))

        new_order = Orders(
            user_id=user_id,
            total_price=total_price,
            status="pending"
        )
        db.session.add(new_order)
        db.session.commit()

        for order_item in order_items:
            order_item.order_id = new_order.id
            db.session.add(order_item)

        for product, quantity in product_updates:
            product.stock -= quantity

        db.session.commit()
        Cart.query.filter_by(user_id=user_id).delete()
        db.session.commit()

        return {
            'message': 'Order placed successfully',
            'order': {
                'id': new_order.id,
                'user_id': new_order.user_id,
                'total_price': new_order.total_price,
                'status': new_order.status,
                'items': [{'product_id': item.product_id, 'quantity': item.quantity} for item in order_items]
            }
        }, 201

class OrderResource(Resource):
    @jwt_required()
    def get(self, order_id=None):
        current_user_id = get_jwt_identity()
        
        if isinstance(current_user_id, dict):
            user_role = current_user_id.get('role')
            user_id = current_user_id.get('id')
        else:
            user_id = int(current_user_id) if current_user_id else None
            claims = get_jwt()
            user_role = claims.get('role')

        if user_role == 'admin':
            if order_id:
                order = Orders.query.get(order_id)
                if not order:
                    return {'error': 'Order not found'}, 404
                return self.serialize_order(order), 200
            else:
                orders = Orders.query.all()
                return [self.serialize_order(order) for order in orders], 200
        else:
            if order_id:
                order = Orders.query.filter_by(id=order_id, user_id=user_id).first()
                if not order:
                    return {'error': 'Order not found'}, 404
                return self.serialize_order(order), 200
            else:
                orders = Orders.query.filter_by(user_id=user_id).all()
                return [self.serialize_order(order) for order in orders], 200

    def serialize_order(self, order):
        try:
            items = []
            for item in order.items:
                items.append({
                    'product_id': item.product_id,
                    'quantity': item.quantity,
                    'price': item.price,
                    'name': item.product.name if item.product else 'Unknown',
                    'image': item.product.image if item.product else None
                })
            
            return {
                'id': order.id,
                'user_id': order.user_id,
                'total_price': order.total_price,
                'status': order.status,
                'created_at': order.created_at.isoformat() if order.created_at else None,
                'items': items
            }
        except Exception as e:
            print(f"Serialize order error: {str(e)}")
            return {
                'id': order.id,
                'user_id': order.user_id,
                'total_price': order.total_price,
                'status': order.status,
                'items': []
            }

    @jwt_required()
    def patch(self, order_id):
        current_user_id = get_jwt_identity()
        
        if isinstance(current_user_id, dict):
            user_role = current_user_id.get('role')
        else:
            claims = get_jwt()
            user_role = claims.get('role')
        
        order = Orders.query.get(order_id)
        if not order:
            return {'error': 'Order not found'}, 404
        
        if order.status == 'completed' and user_role != 'admin':
            return {'error': 'Only an admin can cancel a completed order'}, 403
        
        for item in order.items:
            product = Products.query.get(item.product_id)
            if product:
                product.stock += item.quantity

        order.status = 'canceled'
        
        if order.payment and order.payment.status == "Completed":
            order.payment.status = "Refund Pending"

        db.session.commit()
        return {'message': 'Order canceled successfully'}, 200
        
class Payment(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user_id = get_jwt_identity()
            
            if isinstance(current_user_id, dict):
                user_id = current_user_id.get('id')
                user_role = current_user_id.get('role')
            else:
                user_id = int(current_user_id) if current_user_id else None
                claims = get_jwt()
                user_role = claims.get('role')

            if user_role == 'admin':
                payments = Payments.query.all()
            else:
                payments = Payments.query.filter_by(user_id=user_id).all()

            if not payments:
                return [], 200

            payment_list = []
            for payment in payments:
                payment_dict = {
                    'id': payment.id,
                    'order_id': payment.order_id,
                    'user_id': payment.user_id,
                    'mpesa_receipt_number': payment.mpesa_receipt_number,
                    'phone_number': payment.phone_number,
                    'amount': payment.amount,
                    'status': payment.status,
                    'transaction_date': payment.transaction_date.isoformat() if payment.transaction_date else None,
                    'checkout_request_id': payment.checkout_request_id,
                    'merchant_request_id': payment.merchant_request_id
                }
                payment_list.append(payment_dict)

            return payment_list, 200
            
        except Exception as e:
            print(f"Payments error: {str(e)}")
            import traceback
            traceback.print_exc()
            return {'error': f'Failed to fetch payments: {str(e)}'}, 500
         
class Carts(Resource):
    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        
        try:
            data = request.get_json()
            if not data:
                return {'error': 'Invalid request format'}, 400

            product_id = data.get('product_id')
            quantity = data.get('quantity', 1)

            if not product_id:
                return {'error': 'Product ID is required'}, 400

            product = Products.query.filter_by(id=product_id, deleted_at=None).first()
            if not product:
                return {'error': 'Product not found or has been removed'}, 404

            if product.stock < quantity:
                return {'error': f'Only {product.stock} items available in stock'}, 400

            cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

            if cart_item:
                new_quantity = cart_item.quantity + quantity
                if new_quantity > product.stock:
                    return {'error': f'Only {product.stock} items available in stock'}, 400
                cart_item.quantity = new_quantity
            else:
                cart_item = Cart(user_id=user_id, product_id=product_id, quantity=quantity)
                db.session.add(cart_item)

            db.session.commit()

            return {
                'message': 'Product added to cart successfully',
                'cart_item': {
                    'id': cart_item.id,
                    'product_id': cart_item.product_id,
                    'quantity': cart_item.quantity
                }
            }, 201

        except Exception as e:
            db.session.rollback()
            return {'error': 'An error occurred', 'details': str(e)}, 500

    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())

        cart_items = Cart.query.filter_by(user_id=user_id).all()

        if not cart_items:
            return {'message': 'Cart is empty'}, 200

        serialized_cart = []
        for item in cart_items:
            serialized_cart.append({
                'id': item.id,
                'product_id': item.product_id,
                'quantity': item.quantity,
                'product_name': item.product.name,
                'product_image': item.product.image,
                'price': item.product.price,
                'subtotal': round(item.product.price * item.quantity, 2)
            })

        return serialized_cart, 200

class CartsResource(Resource):
    @jwt_required()
    def delete(self, cart_id=None):
        user_id = int(get_jwt_identity())

        if cart_id is not None:
            cart_item = Cart.query.filter_by(id=cart_id, user_id=user_id).first()
            if not cart_item:
                return {'error': 'Cart item not found'}, 404

            try:
                db.session.delete(cart_item)
                db.session.commit()
                return {'message': 'Item removed from cart successfully'}, 200
            except Exception as e:
                db.session.rollback()
                return {'error': 'Failed to remove item', 'details': str(e)}, 500

        user_cart_items = Cart.query.filter_by(user_id=user_id).all()
        if not user_cart_items:
            return {'message': 'Cart is already empty'}, 200

        try:
            Cart.query.filter_by(user_id=user_id).delete()
            db.session.commit()
            return {'message': 'Cart cleared successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to clear cart', 'details': str(e)}, 500

class Checkout(Resource):
    @jwt_required()
    def post(self):
        try:
            user_id = int(get_jwt_identity())
            
            cart_items = Cart.query.filter_by(user_id=user_id).all()
            
            if not cart_items:
                return {'error': 'Cart is empty, add items first!'}, 400

            total_price = 0
            order_items_data = []

            new_order = Orders(user_id=user_id, total_price=0)
            db.session.add(new_order)
            db.session.commit()

            for cart_item in cart_items:
                product = Products.query.get(cart_item.product_id)

                if not product:
                    return {'error': f'Product with ID {cart_item.product_id} not found!'}, 404

                if product.stock < cart_item.quantity:
                    return {'error': f'Not enough stock for {product.name}. Available: {product.stock}'}, 400

                product.stock -= cart_item.quantity

                item_total = product.price * cart_item.quantity
                total_price += item_total

                order_item = OrderItems(
                    order_id=new_order.id,
                    product_id=product.id,
                    quantity=cart_item.quantity,
                    price=product.price
                )
                db.session.add(order_item)

                order_items_data.append({
                    'product_id': product.id,
                    'name': product.name,
                    'quantity': cart_item.quantity,
                    'price': product.price
                })

            new_order.total_price = total_price

            Cart.query.filter_by(user_id=user_id).delete()
            db.session.commit()

            try:
                user = Users.query.get(user_id)
                if user and user.email:
                    send_order_confirmation_email(user.email, new_order.id)
            except Exception as email_err:
                print(f"Email error (non-critical): {email_err}")

            return {
                'message': 'Order created successfully, proceed to payment.',
                'order_id': new_order.id,
                'total_price': total_price,
                'order_items': order_items_data
            }, 201
            
        except Exception as e:
            print(f"Checkout error: {str(e)}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
            return {'error': 'Checkout failed', 'details': str(e)}, 500

class Comment(Resource):
    def get(self):
        comments = Comments.query.filter(
            Comments.deleted_at.is_(None),
            Comments.parent_id.is_(None)
        ).all()
        
        if not comments:
            return [], 200
        
        result = []
        for comment in comments:
            comment_dict = comment.to_dict()
            replies = Comments.query.filter_by(
                parent_id=comment.id
            ).filter(Comments.deleted_at.is_(None)).all()
            comment_dict['replies'] = [reply.to_dict() for reply in replies]
            result.append(comment_dict)
        
        return result, 200
    
    @jwt_required()
    def post(self):
        current_user_id = int(get_jwt_identity())
        user = Users.query.get(current_user_id)
        if not user:
            return {'error': 'User not found'}, 404
        
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
        
        content = data.get('content')
        product_id = data.get('product_id')
        parent_id = data.get('parent_id')
        
        if not content:
            return {"error": "Comment content is required"}, 422
        
        if not product_id and not parent_id:
            return {"error": "Either product_id or parent_id is required"}, 422
        
        new_comment = Comments(
            content=content,
            user_id=user.id,
            product_id=product_id,
            parent_id=parent_id,
            created_at=datetime.utcnow()
        )
        
        db.session.add(new_comment)
        db.session.commit()
        
        return {
            'id': new_comment.id,
            'content': new_comment.content,
            'created_at': new_comment.created_at.isoformat(),
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email
            },
            'product_id': new_comment.product_id,
            'parent_id': new_comment.parent_id,
            'replies': []
        }, 201
    
class CommentResource(Resource):
    def get(self, id=None, product_id=None):
        if product_id:
            comments = Comments.query.filter_by(
                product_id=product_id, 
                parent_id=None
            ).filter(Comments.deleted_at.is_(None)).all()
            
            if not comments:
                return [], 200
            
            result = []
            for comment in comments:
                comment_dict = comment.to_dict()
                replies = Comments.query.filter_by(
                    parent_id=comment.id
                ).filter(Comments.deleted_at.is_(None)).all()
                comment_dict['replies'] = [reply.to_dict() for reply in replies]
                result.append(comment_dict)
            
            return result, 200

        elif id:
            comment = Comments.query.filter_by(
                id=id
            ).filter(Comments.deleted_at.is_(None)).first()
            
            if not comment:
                return {'error': 'Comment not found!'}, 404
            
            result = comment.to_dict()
            replies = Comments.query.filter_by(
                parent_id=comment.id
            ).filter(Comments.deleted_at.is_(None)).all()
            result['replies'] = [reply.to_dict() for reply in replies]
            
            return result, 200

        return {'error': 'Invalid request, product_id or id required'}, 400

    @jwt_required()
    def delete(self, id):
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id) if isinstance(current_user_id, (int, str)) else None
        
        claims = get_jwt()
        user_role = claims.get('role')

        comment = Comments.query.get(id)
        
        if not comment or comment.deleted_at is not None:
            return {'message': 'Comment not found!'}, 404
        
        if user_role != 'admin' and comment.user_id != user_id:
            return {'error': 'You are not authorized to delete this comment!'}, 403
        
        comment.deleted_at = datetime.utcnow()
        db.session.commit()
        
        return {'message': 'Comment deleted successfully!'}, 200
    
class CommentResourceCount(Resource):
    def get(self, comment_id):
        comment = Comments.query.filter_by(id=comment_id).filter(Comments.deleted_at.is_(None)).first()
        if not comment:
            return {"error": "Comment not found"}, 404
        likes_count = Likes.query.filter_by(comment_id=comment_id).count()
        return {"comment": comment.to_dict(), "likes_count": likes_count}, 200
    
class Reply(Resource):
    @jwt_required()
    def post(self, comment_id):
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id) if isinstance(current_user_id, (int, str)) else None
        
        if not user_id:
            return {"error": "User not authenticated"}, 401
        
        data = request.get_json()
        
        if not data or "content" not in data:
            return {"error": "Missing 'content' field"}, 422
        
        parent_comment = Comments.query.filter_by(id=comment_id, deleted_at=None).first()
        if not parent_comment:
            return {"error": "Parent comment not found or has been deleted"}, 404
        
        if parent_comment.parent_id is not None:
            return {"error": "Cannot reply to a reply"}, 400
        
        user = Users.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
        
        reply = Comments(
            content=data["content"],
            user_id=user.id,
            parent_id=comment_id,
            product_id=parent_comment.product_id,
            created_at=datetime.utcnow()
        )
        
        db.session.add(reply)
        db.session.commit()
        
        return {
            'id': reply.id,
            'content': reply.content,
            'created_at': reply.created_at.isoformat(),
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email
            },
            'parent_id': reply.parent_id,
            'product_id': reply.product_id
        }, 201
    
    def get(self, comment_id):
        parent_comment = Comments.query.filter_by(id=comment_id).filter(Comments.deleted_at.is_(None)).first()
        if not parent_comment:
            return {"error": "Parent comment not found"}, 404
        
        if parent_comment.parent_id is not None:
            return {"error": "Cannot fetch replies of a reply"}, 400
        
        replies = Comments.query.filter_by(parent_id=comment_id).filter(Comments.deleted_at.is_(None)).all()
        
        result = []
        for reply in replies:
            result.append({
                'id': reply.id,
                'content': reply.content,
                'created_at': reply.created_at.isoformat(),
                'user': {
                    'id': reply.user.id,
                    'name': reply.user.name,
                    'email': reply.user.email
                } if reply.user else None,
                'parent_id': reply.parent_id
            })
        
        return result, 200
    
class ReplyResource(Resource):
    @jwt_required()
    def delete(self, comment_id, reply_id):
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id) if isinstance(current_user_id, (int, str)) else None
        
        claims = get_jwt()
        user_role = claims.get('role')
        
        parent_comment = Comments.query.get(comment_id)
        if not parent_comment or parent_comment.deleted_at is not None:
            return {"error": "Parent comment not found"}, 404
        
        if parent_comment.parent_id is not None:
            return {"error": "Cannot delete a reply to a reply"}, 400
        
        reply = Comments.query.get(reply_id)
        if not reply or reply.deleted_at is not None:
            return {"error": "Reply not found"}, 404
        
        if reply.parent_id is None:
            return {"error": "The provided ID is not a reply"}, 400
        
        if reply.parent_id != parent_comment.id:
            return {"error": "Reply does not belong to this comment"}, 400
        
        if reply.user_id != user_id and user_role != "admin":
            return {"error": "You are not authorized to delete this reply"}, 403
        
        reply.deleted_at = datetime.utcnow()
        db.session.commit()
        
        return {"message": "Reply deleted successfully!"}, 200
    
class LikeResource(Resource):
    @jwt_required()
    def post(self, product_id):
        user_id = int(get_jwt_identity())

        product = Products.query.filter_by(id=product_id, deleted_at=None).first()
        if not product:
            return {"error": "Product not found or has been deleted"}, 404

        existing_like = Likes.query.filter_by(user_id=user_id, product_id=product_id).first()
        if existing_like:
            return {"error": "You have already liked this product"}, 400

        like = Likes(user_id=user_id, product_id=product_id)
        db.session.add(like)
        db.session.commit()

        return {"message": "Product liked successfully!"}, 201

    @jwt_required()
    def delete(self, product_id):
        user_id = int(get_jwt_identity())

        product = Products.query.filter_by(id=product_id, deleted_at=None).first()
        if not product:
            return {"error": "Product not found or has been deleted"}, 404

        like = Likes.query.filter_by(user_id=user_id, product_id=product_id).first()
        if not like:
            return {"error": "You have not liked this product yet"}, 400

        db.session.delete(like)
        db.session.commit()

        return {"message": "Like removed successfully!"}, 200

    @jwt_required()
    def get(self, product_id):
        user_id = int(get_jwt_identity())

        existing_like = Likes.query.filter_by(user_id=user_id, product_id=product_id).first()
        likes_count = Likes.query.filter_by(product_id=product_id).count()

        return {
            "liked": existing_like is not None,
            "likes_count": likes_count
        }, 200
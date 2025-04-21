<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation #{{ $order->order_number }}</title>
    <style>
        /* Base styles */
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }

        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eee;
        }

        .logo {
            max-width: 150px;
            height: auto;
        }

        .order-number {
            font-size: 24px;
            font-weight: bold;
            color: #2d3748;
            margin: 20px 0 10px;
        }

        .thank-you {
            font-size: 18px;
            color: #4a5568;
            margin-bottom: 20px;
        }

        .order-details {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }

        .detail-row {
            display: flex;
            margin-bottom: 10px;
        }

        .detail-label {
            font-weight: bold;
            width: 150px;
            color: #4a5568;
        }

        .detail-value {
            flex: 1;
        }

        .product-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .product-table th {
            background-color: #edf2f7;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            color: #4a5568;
        }

        .product-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }

        .product-table tr:last-child td {
            border-bottom: none;
        }

        .total-row {
            font-weight: bold;
            background-color: #f8fafc;
        }

        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4299e1;
            color: white !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
        }

        .footer {
            text-align: center;
            padding: 20px;
            color: #718096;
            font-size: 14px;
            border-top: 1px solid #eee;
        }

        @media only screen and (max-width: 600px) {
            .email-container {
                padding: 10px;
            }

            .detail-row {
                flex-direction: column;
            }

            .detail-label {
                width: 100%;
                margin-bottom: 5px;
            }
        }

        @media only screen and (max-width: 480px) {
            .product-table {
                font-size: 14px;
            }

            .product-table th,
            .product-table td {
                padding: 8px 4px;
            }

            .button {
                display: block;
                margin: 20px auto;
                width: 80%;
                text-align: center;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <h1>HI-TECH</h1>
        </div>

        <h1 class="order-number">Order #{{ $order->id }}</h1>
        <p class="thank-you">Thank you for your order!</p>

        <div class="order-details">
            <div class="detail-row">
                <span class="detail-label">Order Date:</span>
                <span class="detail-value">{{ $order->created_at->format('F j, Y') }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Order Total:</span>
                <span class="detail-value">${{ number_format($order->total, 2) }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">{{ $order->paymentStatus }}</span>
            </div>
            @if ($order->shipping)
                <div class="detail-row">
                    <span class="detail-label">Shipping Address:</span>
                    <span class="detail-value">
                        {{ $order->shipping->address_1 }}<br>
                        @if ($order->shipping->address_2)
                            {{ $order->shipping->address_2 }}<br>
                        @endif
                        {{ $order->shipping->city }}, {{ $order->shipping->province }}
                        {{ $order->shipping->zipCode }}<br>
                        {{ $order->shipping->country }}
                    </span>
                </div>
            @endif
        </div>

        <h2>Order Items</h2>
        <table class="product-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($orderItems as $item)
                    <tr>
                        <td>{{ $item->product->name }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>${{ number_format($item->price, 2) }}</td>
                    </tr>
                @endforeach
                <tr class="total-row">
                    <td colspan="2">Subtotal</td>
                    <td>${{ number_format($order->subTotal, 2) }}</td>
                </tr>
                @if ($order->shipping_cost > 0)
                    <tr>
                        <td colspan="2">Shipping</td>
                        <td>${{ number_format($order->shipCost, 2) }}</td>
                    </tr>
                @endif
                @if ($order->tax_amount > 0)
                    <tr>
                        <td colspan="2">Tax</td>
                        <td>${{ number_format($order->tax, 2) }}</td>
                    </tr>
                @endif
                <tr class="total-row">
                    <td colspan="2">Total</td>
                    <td>${{ number_format($order->total, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <div style="text-align: center;">
            <a href="{{ route('order.details', $order->id) }}" class="button">View Your Order</a>
        </div>

        <div class="footer">
            <p>If you have any questions about your order, please contact our support team at <a
                    href="mailto:support@example.com">support@example.com</a>.</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>

</html>

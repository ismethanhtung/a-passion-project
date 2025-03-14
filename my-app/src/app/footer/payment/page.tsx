import React from "react";

const PaymentPage = () => {
    return (
        <div className="max-w-3xl mx-auto px-6 mt-10 py-12 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold mb-4">Payment Policy</h1>
            <p className="text-gray-700 mb-4">
                Thank you for choosing Language Mastery for your language learning needs. We strive
                to provide a seamless and secure payment experience. Below is our payment policy to
                ensure you understand how payments are processed and managed.
            </p>
            <h2 className="text-2xl font-semibold mb-4">1. Accepted Payment Methods</h2>
            <p className="text-gray-700 mb-4">We accept the following payment methods:</p>
            <ul className="list-disc pl-4 mb-4 text-gray-700">
                <li>Credit and debit cards (Visa, Mastercard, American Express)</li>
                <li>PayPal</li>
                <li>Apple Pay</li>
                <li>Google Pay</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4">2. Payment Processing</h2>
            <p className="text-gray-700 mb-4">
                All payments are processed through our secure payment gateway, which uses
                industry-standard encryption to protect your financial information.
            </p>
            <h2 className="text-2xl font-semibold mb-4">3. Order Confirmation</h2>
            <p className="text-gray-700 mb-4">
                Once your payment is successfully processed, you will receive an order confirmation
                email with details of your purchase.
            </p>
            <h2 className="text-2xl font-semibold mb-4">4. Refunds and Cancellations</h2>
            <p className="text-gray-700 mb-4">
                Our refund policy can be found
                [here](https://www.languagemastery.com/refund-policy). Please review it for
                information on how to request a refund or cancel your order.
            </p>
            <h2 className="text-2xl font-semibold mb-4">5. Currency</h2>
            <p className="text-gray-700 mb-4">
                All prices are listed in USD. If you are paying from a country outside the United
                States, your bank may apply conversion rates and fees.
            </p>
            <h2 className="text-2xl font-semibold mb-4">6. Taxes</h2>
            <p className="text-gray-700 mb-4">
                Depending on your location, sales tax or VAT may be added to your order total. This
                will be calculated and displayed during the checkout process.
            </p>
            <h2 className="text-2xl font-semibold mb-4">7. Security</h2>
            <p className="text-gray-700">
                We take the security of your payment information very seriously. Our payment gateway
                is PCI DSS compliant, ensuring that your data is handled securely.
            </p>
            <p className="text-gray-700">
                If you have any questions or concerns regarding payments, please contact our
                customer support team at
                [support@languagemastery.com](mailto:support@languagemastery.com).
            </p>
        </div>
    );
};

export default PaymentPage;

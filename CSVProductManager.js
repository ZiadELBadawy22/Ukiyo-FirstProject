import React from 'react';

const CSVProductManager = ({ products, onImport }) => {
    // This function converts your product data into a CSV string and triggers a download
    const exportToCSV = () => {
        const headers = ["id", "name", "description", "price", "salePrice", "quantity", "category", "isNew", "keywords", "imageUrls"];
        
        const rows = products.map(p => {
            return headers.map(header => {
                let value = p[header];
                if (Array.isArray(value)) {
                    return `"${value.join(';')}"`; // Join arrays with a semicolon
                }
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`; // Wrap strings with commas in quotes
                }
                return value;
            }).join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\r\n" + rows.join("\r\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ukiyo_products.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // This function handles the file selection and passes the content to the AdminPage
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onImport(e.target.result);
            };
            reader.readAsText(file);
        }
        event.target.value = null; // Reset input to allow re-uploading the same file
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mt-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Bulk Import / Export</h4>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-gray-600">Download your product data to edit in bulk or upload a file to update your store.</p>
                <div className="flex items-center gap-2">
                    <button onClick={exportToCSV} className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">Export as CSV</button>
                    <label className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 cursor-pointer">
                        <span>Import from CSV</span>
                        <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default CSVProductManager;


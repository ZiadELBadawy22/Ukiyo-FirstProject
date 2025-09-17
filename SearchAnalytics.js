import React, { useMemo } from 'react';

const SearchAnalytics = ({ searchData }) => {
    const { topSearches, noResultsSearches } = useMemo(() => {
        if (!searchData || Object.keys(searchData).length === 0) {
            return { topSearches: [], noResultsSearches: [] };
        }

        const allSearches = Object.values(searchData);
        
        const top = [...allSearches]
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const noResults = allSearches
            .filter(item => !item.foundResults)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        return { topSearches: top, noResultsSearches: noResults };
    }, [searchData]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Top Customer Searches</h4>
                <ul className="divide-y divide-gray-200">
                    {topSearches.length > 0 ? topSearches.map(item => (
                        <li key={item.term} className="py-2 flex justify-between items-center">
                            <span className="text-gray-700">{item.term}</span>
                            <span className="font-semibold text-gray-900">{item.count} searches</span>
                        </li>
                    )) : <p className="text-center py-4 text-gray-500">No search data yet.</p>}
                </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                {/* --- MODIFIED: Title updated --- */}
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Searches With No Results</h4>
                <ul className="divide-y divide-gray-200">
                    {noResultsSearches.length > 0 ? noResultsSearches.map(item => (
                        <li key={item.term} className="py-2 flex justify-between items-center">
                            <span className="text-red-600 font-medium">{item.term}</span>
                            <span className="font-semibold text-gray-900">{item.count} searches</span>
                        </li>
                    )) : <p className="text-center py-4 text-gray-500">No unsuccessful searches recorded yet.</p>}
                </ul>
            </div>
        </div>
    );
};

export default SearchAnalytics;


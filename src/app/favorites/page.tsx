export default function FavoritesPage() {
  // Sample favorite perks data
  const favorites = [
    {
      id: 1,
      business: "Starbucks",
      description: "Free drink on your birthday",
      expiry: "Valid on your birthday only",
      value: "$5",
      dateAdded: "03/15/2023"
    },
    {
      id: 2,
      business: "Sephora",
      description: "Free beauty gift during birthday month",
      expiry: "Valid during your birthday month",
      value: "$10",
      dateAdded: "03/20/2023"
    },
    {
      id: 3,
      business: "Cheesecake Factory",
      description: "Free slice of cheesecake",
      expiry: "Valid 7 days from birthday",
      value: "$8",
      dateAdded: "04/01/2023"
    }
  ];

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">My Favorite Perks</h1>
        <p className="mt-2 text-gray-600">
          Quick access to your favorite birthday perks
        </p>
      </div>

      <div className="overflow-hidden bg-white shadow border border-gray-200 sm:rounded-lg">
        {favorites.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Business
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Expiry
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date Added
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {favorites.map((favorite) => (
                <tr key={favorite.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {favorite.business}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {favorite.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {favorite.expiry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {favorite.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {favorite.dateAdded}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-600 hover:text-red-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center text-gray-500">
            You have not added any favorite perks yet.
          </div>
        )}
      </div>
    </div>
  );
} 
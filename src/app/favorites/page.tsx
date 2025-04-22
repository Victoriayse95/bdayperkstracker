export default function FavoritesPage() {
  // Sample favorites data - in a real app, this would come from a database or API
  const favorites = [
    {
      id: 1,
      business: "Starbucks",
      perk: "Free drink of your choice",
      expiryDate: "04/26/2023",
      value: "$5",
      notes: "Must have the Starbucks app"
    },
    {
      id: 2,
      business: "Sephora",
      perk: "Free beauty gift",
      expiryDate: "04/30/2023",
      value: "$10",
      notes: "Can be claimed in-store or online"
    },
    {
      id: 3,
      business: "Baskin-Robbins",
      perk: "Free ice cream scoop",
      expiryDate: "04/23/2023",
      value: "$3",
      notes: "Single scoop of any flavor"
    }
  ];

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <p className="mt-2 text-gray-600">
          Your saved favorite birthday perks
        </p>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        {favorites.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">You haven't added any favorites yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {favorites.map((favorite) => (
              <li key={favorite.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{favorite.business}</h3>
                    <p className="mt-1 text-sm text-gray-500">{favorite.perk}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-500">Value: {favorite.value}</span>
                    <span className="text-sm font-medium text-gray-500">Expires: {favorite.expiryDate}</span>
                    <button className="p-2 text-red-600 hover:text-red-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500">{favorite.notes}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 
import Link from 'next/link';

export default function PerksPage() {
  // Sample perks data - in a real app, this would come from a database or API
  const perks = [
    {
      id: 1,
      business: "Starbucks",
      description: "Free drink of your choice on your birthday",
      requirements: "Must be a Starbucks Rewards member",
      expiry: "Valid on your birthday only"
    },
    {
      id: 2,
      business: "Sephora",
      description: "Free beauty gift on your birthday month",
      requirements: "Must be a Beauty Insider member",
      expiry: "Valid during your birthday month"
    },
    {
      id: 3,
      business: "Baskin-Robbins",
      description: "Free ice cream scoop",
      requirements: "Join their birthday club",
      expiry: "Valid within 2 weeks of birthday"
    },
    {
      id: 4,
      business: "Denny's",
      description: "Free Grand Slam breakfast",
      requirements: "Show valid ID",
      expiry: "Valid on your birthday only"
    },
    {
      id: 5,
      business: "Ulta Beauty",
      description: "Free birthday gift with any purchase",
      requirements: "Must be an Ultamate Rewards member",
      expiry: "Valid during your birthday month"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Birthday Perks
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Check out these great birthday offers from popular businesses
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {perks.map((perk) => (
              <li key={perk.id}>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{perk.business}</h3>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Birthday Offer
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p className="mb-2">{perk.description}</p>
                    <p className="text-xs"><strong>Requirements:</strong> {perk.requirements}</p>
                    <p className="text-xs"><strong>Expiry:</strong> {perk.expiry}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 
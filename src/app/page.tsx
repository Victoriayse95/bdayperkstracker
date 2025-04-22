import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">Perks to Claim</h1>
        <p className="mt-2 text-gray-600">
          Birthday perks with service scheduled in exactly 3 days from now
        </p>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg mb-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search perks..."
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <Link
            href="/perks/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add New Perk
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Business Name ↓
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Contact ↓
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Category ↓
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Expiry Date ↓
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Value ↓
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Status ↓
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Notes
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
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Starbucks
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  555-123-4567
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Coffee & Drinks
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  04/26/2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $5
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Reminder Sent
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Free drink on birthday - mobile app required
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-6">
        <h2 className="text-2xl font-bold text-gray-900">Calendar View</h2>
        <p className="mt-2 text-gray-600">
          Perk schedule for April 2023
        </p>
      </div>

      <div className="bg-white p-4 shadow sm:rounded-lg">
        <div className="flex justify-between mb-4">
          <button className="px-4 py-2 border border-gray-300 text-sm rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </button>
          <button className="px-4 py-2 border border-gray-300 text-sm rounded-md flex items-center">
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          <div className="bg-white p-2 text-center font-medium">Sun</div>
          <div className="bg-white p-2 text-center font-medium">Mon</div>
          <div className="bg-white p-2 text-center font-medium">Tue</div>
          <div className="bg-white p-2 text-center font-medium">Wed</div>
          <div className="bg-white p-2 text-center font-medium">Thu</div>
          <div className="bg-white p-2 text-center font-medium">Fri</div>
          <div className="bg-white p-2 text-center font-medium">Sat</div>
          
          {/* Calendar days - first row */}
          <div className="bg-white p-2 h-24 border-t"></div>
          <div className="bg-white p-2 h-24 border-t"></div>
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">1</div>
          </div>
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">2</div>
          </div>
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">3</div>
          </div>
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">4</div>
          </div>
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">5</div>
          </div>
          
          {/* Second row */}
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">6</div>
          </div>
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">7</div>
          </div>
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">8</div>
          </div>
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">9</div>
          </div>
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">10</div>
          </div>
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">11</div>
          </div>
          <div className="bg-white p-2 h-24 border-t">
            <div className="text-right">12</div>
          </div>
        </div>
      </div>
    </div>
  );
}

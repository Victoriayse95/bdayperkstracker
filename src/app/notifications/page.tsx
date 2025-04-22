export default function NotificationsPage() {
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "Starbucks birthday perk expiring soon",
      message: "Your Starbucks birthday perk will expire in 3 days. Don't forget to redeem it!",
      date: "Apr 22, 2023",
      isRead: false
    },
    {
      id: 2,
      title: "New perk added: Dunkin' Donuts",
      message: "A new birthday perk has been added from Dunkin' Donuts. Check it out!",
      date: "Apr 20, 2023",
      isRead: true
    },
    {
      id: 3,
      title: "Reminder: Update your profile",
      message: "Please update your profile to receive personalized birthday perk recommendations.",
      date: "Apr 15, 2023",
      isRead: true
    }
  ];

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-2 text-gray-600">
          Stay updated with your birthday perks and reminders
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200 px-4 py-4 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent notifications</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-900">Mark all as read</button>
        </div>
        <ul className="divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <li className="p-4 text-center text-gray-500">
              No notifications yet
            </li>
          ) : (
            notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 ${notification.isRead ? '' : 'bg-blue-50'}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {!notification.isRead && (
                      <span className="inline-block h-2 w-2 rounded-full bg-indigo-600"></span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500">{notification.date}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
} 
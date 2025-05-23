const EventOccurence = ({ event }) => {
    const eventDate = new Date(event.dates);
    const isPast = isNaN(eventDate.getTime()) || eventDate < new Date();

    return (
        <div
            key={event.id}
            className={`rounded-xl p-5 shadow-md transition-all border ${isPast
                    ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-50 grayscale cursor-not-allowed pointer-events-none'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:shadow-xl'
                }`}
        >
            <h4 className="text-lg font-semibold text-green-600 dark:text-green-400">{event.name}</h4>

            {/* Event Date */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                🗓 {isNaN(eventDate.getTime()) ? 'Invalid date' : eventDate.toDateString()}
            </p>

            {/* Hosted by Organization */}
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Hosted by: {event.organization?.name || 'Unknown Org'}
            </p>

            {/* Warning Label */}
            {isPast && (
                <p className="mt-3 text-sm font-medium text-red-500">
                    ⚠️ This event has already occurred or has an invalid date
                </p>
            )}
        </div>
    );
}

export default EventOccurence;
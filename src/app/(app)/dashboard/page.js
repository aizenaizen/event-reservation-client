"use client"

import Header from '@/app/(app)/Header'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth';

const Dashboard = () => {
    const { user } = useAuth({ middleware: 'guest' });
    console.log(user);

    //Event List
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetchEvents();
        fetchReservations();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`/api/events?page=${currentPage}`);

            let last_page = response.data.last_page
            if (last_page < totalPages && currentPage == totalPages) {
                setCurrentPage(last_page)
            }

            setEvents(response.data.data);
            setTotalPages(response.data.meta.last_page);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`/api/reservations?page=all`);
            setReservations(response.data.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    //Event Creation
    const modalRef = useRef(null);
    const showModalButtonRef = useRef(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        datetime: '',
        deadline: '',
        location: '',
        price: '',
        attendee_limit: ''
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.keyCode === 27) {
                // ESC key
                setShowModal(false);
            }
        };

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && event.target !== showModalButtonRef.current) {
                setShowModal(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleFormFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleEventCreation = async () => {
        try {
            const response = await axios.post(`/api/events`, formData);
            if(response?.data?.status == 'success') {
                alert('Event has been created!');
            }
            setShowModal(false);
            fetchEvents();
        } catch (error) {
            alert(error?.response?.data?.message);
        }
    };

    // Date with Time format
    const formattedDateTime = (datetime) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };

        return new Date(datetime).toLocaleString('en-US', options);
    }

    //Reserve Event
    const handleReserveEvent = async (eventId, eventTitle) => {
        console.log(`Reserve event with ID: ${eventId}`);

        try {
            if(confirm('Are you sure you want to reserve event '+eventTitle+'?')) {
                const response = await axios.post(`/api/reservations`, {'event_id': eventId, 'reserver_id': user.data.id});
                if(response?.data?.status == 'success'){
                    // alert('Reserved! Enjoy the event!');
                }
            }
            fetchReservations();
            fetchEvents();
        } catch (error) {
            alert(error?.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    Events
                </div>
            </div>
            {user.data.user_type_id != 4 ? (
            <div className="py-3 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <button
                    className="px-3 m-3 py-2 text-sm rounded-md bg-yellow-500 text-white"
                    onClick={() => setShowModal(true)}
                    ref={showModalButtonRef}
                >
                    Create Event
                </button>
            </div>
            ) : (<span></span>)}
            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="border-collapse table-auto w-full text-sm">
                                    <thead className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="font-medium p-4">#</td>
                                            <td className="font-medium p-4">Title</td>
                                            <td className="font-medium p-4">Description</td>
                                            <td className="font-medium p-4">Event Date</td>
                                            <td className="font-medium p-4">Location</td>
                                            <td className="font-medium p-4">Price</td>
                                            <td className="font-medium p-4"></td>
                                        </tr>
                                    </thead>
                                {events.map((event) => (
                                    <tbody className="bg-white divide-y divide-gray-200" key={event.id}>
                                        <tr>
                                            <td className="p-4">{event.id}</td>
                                            <td className="p-4">{event.attributes.title}</td>
                                            <td className="p-4">{event.attributes.description}</td>
                                            <td className="p-4">{event.attributes.event_date}</td>
                                            <td className="p-4">{event.attributes.location}</td>
                                            <td className="p-4">{event.attributes.price}</td>
                                            <td className="p-4">
                                                {user.data.user_type_id == 4 ? (
                                                    reservations.find(({event_id: id}) => id === event.id) === undefined ? (
                                                        event.attributes.available > 0 ? (
                                                            <button className="px-3 py-2 mx-1 text-xs rounded-md bg-blue-500 text-white" 
                                                                onClick={() => handleReserveEvent(event.id, event.attributes.title)}>Reserve</button>
                                                        ) : (
                                                            <button className="px-3 py-2 mx-1 text-xs rounded-md bg-red-500 text-white disabled">Fully Booked</button>
                                                        )
                                                    ) : (
                                                        <button className="px-3 py-2 mx-1 text-xs rounded-md bg-green-500 text-white disabled">Reserved</button>
                                                    )

                                                ) : ('')}
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={`px-3 py-2 mx-1 rounded-md ${currentPage === page ? 'bg-stone-700 text-white' : 'bg-gray-200'}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-gray-900 opacity-75"></div>
                    <div className="bg-white w-100 md:w-1/2 p-6 rounded-lg shadow-lg relative overflow-y-auto h-[38rem] md:h-[42rem]" ref={modalRef}>
                        <h3 className="text-lg font-semibold mb-4">Create Event</h3>
                        {/* Form Fields */}
                        <div className="mb-4">
                            <label htmlFor="title" className="block font-medium">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="w-full border-gray-300 rounded-md"
                                value={formData.title}
                                onChange={handleFormFieldChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block font-medium">
                                Description
                            </label>
                            <textarea
                                name="description"
                                rows="4"
                                className="w-full border-gray-300 rounded-md"
                                value={formData.description}
                                onChange={handleFormFieldChange}
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="datetime" className="block font-medium">
                                Event Date
                            </label>
                            <input
                                type="datetime-local"
                                name="event_date"
                                className="w-full border-gray-300 rounded-md"
                                value={formData.event_date}
                                onChange={handleFormFieldChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="location" className="block font-medium">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                className="w-full border-gray-300 rounded-md"
                                value={formData.location}
                                onChange={handleFormFieldChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block font-medium">
                                Price
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="price"
                                className="w-full border-gray-300 rounded-md"
                                value={formData.price}
                                onChange={handleFormFieldChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="attendees" className="block font-medium">
                                Attendees
                            </label>
                            <input
                                type="number"
                                name="attendees"
                                className="w-full border-gray-300 rounded-md"
                                value={formData.attendees}
                                onChange={handleFormFieldChange}
                            />
                        </div>
                        {/* Buttons */}
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-3 py-2 text-sm rounded-md bg-stone-700 text-white mr-2"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-3 py-2 text-sm rounded-md bg-lime-500 text-white"
                                onClick={handleEventCreation}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 

export default Dashboard
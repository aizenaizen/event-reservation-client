"use client"

import Header from '@/app/(app)/Header'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth';

const Reservations = () => {
    const { user } = useAuth({ middleware: 'guest' });

    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        fetchReservations();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`/api/reservations?page=${currentPage}`);

            let last_page = response.data.last_page
            if (last_page < totalPages && currentPage == totalPages) {
                setCurrentPage(last_page)
            }

            setReservations(response.data.data);
            setTotalPages(response.data.meta.last_page);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const cancelReservation = async (reserveId, eventTitle) => {
        try {
            if(confirm('Are you sure you want to cancel event '+eventTitle+'?')) {
                const response = await axios.delete(`/api/reservations/`+reserveId);
                if(response?.data?.status == 'success'){
                    // alert('Event canceled!');
                }
            }
            fetchReservations();
        } catch (error) {
            alert(error?.response?.data?.message);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    Reservations
                </div>
            </div>
            <div className="py-12">
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
                                            <td className="font-medium p-4"></td>
                                        </tr>
                                    </thead>
                                {reservations.map((reservation) => (
                                    <tbody className="bg-white divide-y divide-gray-200" key={reservation.id}>
                                        <tr>
                                            <td className="p-4">{reservation.event_id}</td>
                                            <td className="p-4">{reservation.relationships.reserved.attributes.title}</td>
                                            <td className="p-4">{reservation.relationships.reserved.attributes.description}</td>
                                            <td className="p-4">{reservation.relationships.reserved.attributes.event_date}</td>
                                            <td className="p-4">{reservation.relationships.reserved.attributes.location}</td>
                                            <td className="p-4">-</td>
                                            <td className="p-4"><button className="px-3 py-2 mx-1 text-xs rounded-md bg-red-500 text-white" onClick={() => cancelReservation(reservation.id, reservation.relationships.reserved.attributes.title)}>Cancel</button>
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
        </div>
        
    );
} 

export default Reservations
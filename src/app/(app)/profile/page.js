"use client"

import Header from '@/app/(app)/Header'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth';

const Profile = () => {
    const { user } = useAuth({ middleware: 'guest' });

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    My Profile
                </div>
            </div>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="border-collapse table-auto w-full text-sm">
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <th className="p-4">User ID</th>
                                            <td className="p-4">{user.data.id  ?? '-'}</td>
                                            <th className="p-4">Company Name</th>
                                            <td className="p-4">{user.data.company_name ?? '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <td className="p-4">{user.data.name ?? '-'}</td>
                                            <th className="p-4">Company Address</th>
                                            <td className="p-4">{user.data.company_address ?? '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-4">Email</th>
                                            <td className="p-4">{user.data.email ?? '-'}</td>
                                            <th className="p-4">Employee Since</th>
                                            <td className="p-4">{user.data.hire_date ?? '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-4">Address</th>
                                            <td className="p-4">{user.data.personal_address ?? '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-4">Member Since</th>
                                            <td className="p-4">{user.data.created_at ?? '-'}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-4">User Type</th>
                                            <td className="p-4">{user.data.user_type.type ?? '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
} 

export default Profile
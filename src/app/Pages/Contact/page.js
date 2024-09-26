"use client"

import Navbar from '@/Components/Navbar'
import { useState } from 'react'
import Link from 'next/link';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitForm, setSubmitForm] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setSubmitForm(true);
            } else {
                setError('Failed to send message.');
            }
        } catch (error) {
            console.error('Error submitting form', error);
            setError('Failed to send message');
        }
    };

    return(
        <div className="bg-Yellow-Green min-h-screen">
            <Navbar />
            <div className="flex flex-col xs:flex-col md:flex-row items-center items-center justify-center xs:gap-10 lg:gap-32 md:p-6">
                <div className="xs:text-center md:text-left">
                    <p className="font-semibold text-3xl">Contact Us</p>
                    <p className="mt-4">Fill out the form and our term will get back to you as soon as possible.</p>
                    <p className="mt-1">EatsInReach@gmail.com</p>
                </div>
                <div className="bg-gray-100 xs:mt-0 md:mt-20 lg:mt-20 p-10 rounded-xl xs:w-2/3 md:w-1/2 lg:w-1/3">
                    <h3 className="text-center font-semibold text-2xl mb-2">Get in Touch</h3>
                    {submitForm ? ( 
                        <p>Message sent successfully.</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label className="block">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full mt-1 outline outline-1 outline-gray-400 rounded-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block">Email</label>
                                <input
                                    type="email"
                                    className="w-full mt-1 outline outline-1 outline-gray-400 rounded-sm"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full mt-1 outline outline-1 outline-gray-400 rounded-sm"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="bg-black text-white rounded-md p-1 mt-1 align-center w-full">Submit</button>
                            {error && <p>{error}</p>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
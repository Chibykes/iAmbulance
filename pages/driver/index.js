import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { GiAmbulance } from 'react-icons/gi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Index(){

    const [form, setForm] = useState({});
    const router = useRouter();

    const handleSubmit = () => {
        if(form.username === "driver1"){
            if(form.password === "pass1234"){
                toast('✅ Login Successful');
                return router.push('/driver/emergencies');
            }

            return toast('❌ Password incorrect');
        }

        return toast('❌ Username incorrect');
    }

    return(
        <main className="relative space-y-6 max-w-md mx-auto w-screen min-h-screen flex flex-col justify-between">
            <ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={true}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>

            <div id="map" className='flex justify-center items-center absolute h-[65vh] w-full top-0 left-0'>
                <div className="flex flex-col justify-center items-center font-bold gap-1">
                    <GiAmbulance className="text-red-500 text-3xl" />
                    <p className="text-xl">iAmbulance</p>
                </div>
            </div>

            <div className="bg-white space-y-4 absolute bottom-0 left-0 w-full min-h-[40vh] rounded-t-3xl shadow-2xl p-8 px-16">
                <p className='text-sm text-center font-bold'>Login</p>

                <div className='text-xs py-1 px-3 border border-neutral-500 rounded-full'>
                    <input 
                        className='block w-full border-none'
                        name="username"
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                    />
                </div>

                <div className='text-xs py-1 px-3 border border-neutral-500 rounded-full'>
                    <input 
                        className='block w-full border-none'
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                    />
                </div>

                <div onClick={handleSubmit} href="/" className='block mx-auto first-line:hover:ring-red-500 hover:bg-red-500 ring-offset-2 ring-2 ring-transparent py-4 text-white text-center uppercase text-sm font-bold bg-red-500 cursor-pointer rounded-full'>Login</div>
                {/* <div className="" id="reload-map" onClick={() => { } } >Crack</div> */}
            </div>
        </main>
    );
}
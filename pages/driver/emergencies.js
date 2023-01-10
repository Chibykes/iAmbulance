import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdCall } from 'react-icons/md'
import io from 'socket.io-client';
let socket;

export default function Locate(){

    const router = useRouter();
    const [emergencies, setEmergencies] = useState([]);
    const [driver, setDriver] = useState({
        name: "Ikechukwu Bright",
        phone: "09032932016",
        location: {}
    });

    useEffect(() => {

        socketInitializer();

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        
        function success({coords: { latitude: lat, longitude: lng }}) {
            setDriver({ ...driver, location: {lat, lng}});
        }
        
        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }
        
        navigator.geolocation.getCurrentPosition(success, error, options);

    }, []);

    const socketInitializer = async () => {
        await fetch('/api/socket');
        socket = io();
    
        socket.on('connect', () => {
          console.log('socket client connected');
        })

        socket.on('emergency', (data) => {
            console.log({emergencies});
            fetch(`/api/geodecode?latlng=${Object.values(data.location).join(',')}`)
            .then(res => res.json())
            .then(resp => setEmergencies([...emergencies, {
                ...data,
                address: resp
            }]))
        })
    }

    const acceptEmergency = (emergency) => {
        router.push(`/driver/accept-emergency?driver=${JSON.stringify(driver)}&emergency=${JSON.stringify(emergency)}`)
    }


    return(
        <main className="relative py-10 px-8 space-y-6 max-w-md mx-auto w-screen min-h-screen flex flex-col">

            {/* <div className="bg-white space-y-4 absolute bottom-0 left-0 w-full rounded-t-3xl shadow-2xl p-8"> */}
                <p className='text-sm text-center font-bold'>Emergencies</p>

                <div className='space-y-3'>
                    {emergencies.map(({category, address, location}, index) => 
                        <div key={index} className='relative flex items-center gap-4 bg-neutral-100 rounded-lg p-4'>
                            <div className="absolute bg-red-500 top-2 left-2 grid place-content-center text-white font-bold w-4 h-4 rounded-lg text-[.625rem]">1</div>
                            <div className='relative w-4 h-4'>
                                <Image style={{objectFit: 'contain'}} src="https://img.chibykes.dev/siren.png" fill />
                            </div>

                            <div className='w-full'>
                                <p className='text-sm font-bold capitalize'>{category} Emergency <span className='text-red-500'>@</span></p>
                                <p className='text-sm'>{address}</p>
                                <div onClick={() => acceptEmergency({category, address, location})}
                                    className='block mt-3 mx-auto first-line:hover:ring-red-500 hover:bg-red-500 ring-offset-2 ring-2 ring-transparent py-1 text-white text-center text-xs font-bold bg-red-500 cursor-pointer rounded-full'
                                >Accept</div>
                            </div>
                        </div>
                    )}
                </div>

        </main>
    );
}
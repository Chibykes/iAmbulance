import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GiAmbulance } from 'react-icons/gi';

export default function Index(){

    const [emergency, setEmergency] = useState('');
    const router = useRouter();
    const [findAmbulance, setFindAmbulance] = useState(false);
    
    const simulateSearch = () => {
        setFindAmbulance(true);
        router.push('/find-ambulance')
    }

    const emergencies = [
        { type: "pregnant woman", img: "/img/pregnant-woman.png" },
        { type: "car accident", img: "/img/car-accident.png" },
        { type: "other accident", img: "/img/other-accident.png" },
        { type: "injuries", img: "/img/injuries.png" },
        { type: "poisoning", img: "/img/poison.png" },
        { type: "other", img: "/img/first-aid-kit.png" },
    ]

    return(
        <main className="space-y-6 py-12 px-8 max-w-md mx-auto w-screen min-h-screen flex flex-col justify-between">

            <div className="flex flex-col justify-center items-center font-bold gap-1">
                <GiAmbulance className="text-red-500 text-3xl" />
                <p className="text-xl">iAmbulance</p>

                <div className='pt-2'>
                    <p className='text-xs text-red-500 text-center font-semibold'>In need of an emergency order for <br /> an emergency vehicle online.</p>
                </div>
            </div>


            <div className='space-y-4'>
                <p className='text-xs text-center font-semibold'>Choose emergency category</p>

                <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
                    {emergencies.map(({type, img}, index) => (
                        <div key={index} 
                            onClick={() => setEmergency(type)}
                            className={`${emergency === type ? 'bg-red-500 text-white border-red-500 ring-2 ring-red-300 ring-offset-2' : 'border-neutral-300'} flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-md`}>
                            <div className='relative w-3/4 h-16'>
                                <Image style={{objectFit: 'contain'}} src={img} fill />
                            </div>
                            <p className='text-xs text-center capitalize font-bold'>{type}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div onClick={simulateSearch} className='hover:ring-red-500 hover:bg-red-500 ring-offset-2 ring-2 ring-transparent py-4 text-white text-center uppercase text-sm font-bold bg-black cursor-pointer rounded-full'>Request Ambulance</div>


            {findAmbulance && <div className='bg-white my-[0!important] fixed top-0 left-0 h-full w-full flex flex-col justify-center items-center gap-3'>
                <div className='relative w-10 h-10 animate-bounce'>
                    <Image style={{objectFit: 'contain'}} src="/img/ambulance.png" fill />
                </div>
                <div className='flex justify-center items-center gap-2 m-0'>
                    <div style={{'--delay': 1}} className='rounded-full h-3 w-3 bg-red-500 loading'></div>
                    <div style={{'--delay': 2}} className='rounded-full h-3 w-3 bg-red-500 loading'></div>
                    <div style={{'--delay': 3}} className='rounded-full h-3 w-3 bg-red-500 loading'></div>
                    <div style={{'--delay': 4}} className='rounded-full h-3 w-3 bg-red-500 loading'></div>
                </div>
                <div className='text-xs font-bold'>Finding Available Ambulance...</div>
            </div>}
        </main>
    );
}
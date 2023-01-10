import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdCall } from 'react-icons/md'
import io from 'socket.io-client';
let socket;

export default function Locate(){

    const router = useRouter();
    const [positions, setPositions] = useState({
        origin: {lat: 5.463688, lng: 7.500665},
        destination: {lat: 5.521593, lng: 7.4938994},
    })
    const [details, setDetails] = useState({});

    useEffect(() => {
        
        const markers = [];
        
        function initMap() {
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
            const infowindow = new google.maps.InfoWindow();

            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 7,
                center: positions.origin,
            });
            
            originalMarkers(markers, map);

            showHospitals(map, markers, infowindow);

            directionsRenderer.setMap(map);
            calculateAndDisplayRoute(directionsService, directionsRenderer);
            
        }

        window.initMap = initMap;
        initMap();
        

        function removeMarkers(){
            markers.map((marker) => marker.setMap(null));
        }
        
        function originalMarkers(markers, map) {
            Object.entries(positions)
                .flatMap(t => t)
                .filter(t => typeof t !== 'string')
                .map((pos, index) => {
                    markers.push(new google.maps.Marker({
                        position: pos,
                        map: map,
                        icon: index ? "https://img.chibykes.dev/siren.png" : "https://img.chibykes.dev/ambulance.png",
                    }));
                });
        }

        function showHospitals(map, markers, infowindow) {
            var request = {
                location: positions.origin,
                radius: 2000,
                types: ['hospital', 'health']
            };

            function createMarker(place) {
                if (!place.geometry || !place.geometry.location)
                    return;

                const marker = new google.maps.Marker({
                    map,
                    position: place.geometry.location,
                    icon: 'https://img.chibykes.dev/hospital.png'
                });

                markers.push(marker);

                google.maps.event.addListener(marker, "click", () => {
                    infowindow.setContent(place.name || "");
                    infowindow.open(map);
                });
            }

            let callback = (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    for (let i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }

                    map.setCenter(positions.origin);
                }
            };

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, (callback));
        }

        function calculateAndDisplayRoute(directionsService, directionsRenderer) {
        directionsService
            .route({
            origin: {
                query: `${positions.origin.lat},${positions.origin.lng}`,
            },
            destination: {
                query: `${positions.destination.lat},${positions.destination.lng}`,
            },
            travelMode: google.maps.TravelMode.DRIVING,
            })
            .then((response) => {
            directionsRenderer.setDirections(response);
            })
            .catch((e) => console.log(e));
        }

        fetch(`${window.origin}/api/resolve-location?origin=${positions.origin.lat},${positions.origin.lng}&destination=${positions.destination.lat},${positions.destination.lng}`)
        .then(res => res.json())
        .then(data => setDetails({
            ambulance_location: data.destination_addresses[0],
            duration: data.rows[0].elements[0].duration?.text,
            distance: (data.rows[0].elements[0].distance?.value/1000) + ' km'
        }));

    },[positions]);

    useEffect(() => {

        socketInitializer();

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        
        function success({coords: { latitude: lat, longitude: lng }}) {
            setPositions({ ...positions, origin: {lat, lng}});
        }
        
        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }
        
        navigator.geolocation.getCurrentPosition(success, error, options);

    }, []);

    useEffect(() => {
        
        if(Object.entries(router.query).length > 0){
            const { emergency, driver } = router.query;
            setPositions({...positions, destination: JSON.parse(emergency).location});
            io('https://sockets-vt.herokuapp.com').emit('accept-emergency', JSON.parse(driver));
        }

        return () => {
            io('https://sockets-vt.herokuapp.com').disconnect();
        }

    }, [router])

    // useEffect(() => console.log(router), [router])

    const socketInitializer = async () => {
        socket = io('https://sockets-vt.herokuapp.com');
    
        socket.on('connect', () => {
          console.log('socket client connected');
        })
    }

    return(
        <main className="relative space-y-6 max-w-md mx-auto w-screen min-h-screen flex flex-col justify-between">

            <div id="map" className='absolute h-[65vh] w-full top-0 left-0'></div>

            <div className="bg-white space-y-4 absolute bottom-0 left-0 w-full min-h-[40vh] rounded-t-3xl shadow-2xl p-8">
                <p className='text-sm font-bold'>Emergency details</p>

                <div className='flex justify-between text-xs'>
                    <div className='flex items-center gap-2'>
                        <div className='relative w-4 h-4'>
                            <Image style={{objectFit: 'contain'}} src="https://img.chibykes.dev/ambulance.png" fill />
                        </div>
                        <p className='font-bold'>You</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='relative w-4 h-4'>
                            <Image style={{objectFit: 'contain'}} src="https://img.chibykes.dev/siren.png" fill />
                        </div>
                        <p className='font-bold'>Emergency</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='relative w-4 h-4'>
                            <Image style={{objectFit: 'contain'}} src="https://img.chibykes.dev/hospital.png" fill />
                        </div>
                        <p className='font-bold'>Nearby Hospitals</p>
                    </div>
                </div>

                <div className=''>
                    <p className='text-sm'>???</p>
                    <p className='text-[.625rem] text-red-500 font-semibold'>Patient</p>
                </div>

                <div className=''>
                    <p className='flex justify-between text-sm'>
                        ???
                        <Link href="tel:???" className='grid place-content-center w-6 h-6 bg-red-500 rounded-full hover:ring-red-500 hover:bg-red-500 ring-offset-2 ring-2 ring-transparent'>
                            <MdCall className="text-white font-bold" />
                        </Link>
                    </p>
                    <p className='text-[.625rem] text-red-500 font-semibold'>Phone</p>
                </div>

                <div className=''>
                    <p className='text-sm'>{details?.ambulance_location}</p>
                    <p className='text-[.625rem] text-red-500 font-semibold'>Current Location</p>
                </div>

                <div className='flex gap-20'>
                    <div className=''>
                        <p className='text-sm'>{details?.distance}</p>
                        <p className='text-[.625rem] text-red-500 font-semibold'>Distance</p>
                    </div>
                    <div className=''>
                        <p className='text-sm'>{details?.duration}</p>
                        <p className='text-[.625rem] text-red-500 font-semibold'>Duration</p>
                    </div>
                </div>

                {/* <Link href="/" className='block w-1/2 mx-auto first-line:hover:ring-red-500 hover:bg-red-500 ring-offset-2 ring-2 ring-transparent py-2 text-white text-center uppercase text-sm font-bold bg-red-500 cursor-pointer rounded-full'>Cancel</Link> */}
                {/* <div className="" id="reload-map" onClick={() => { } } >Crack</div> */}
            </div>
        </main>
    );
}
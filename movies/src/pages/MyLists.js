import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import Button from '../components/Button';

const MyLists = () => {
    return(
        <div className="container">
            <h1 className="text-2xl">MyLists</h1>
            <div className="mx-8 grid grid-cols-6 gap-8">
                <div className="rounded-lg bg-sky-100 shadow-2xl  max-w-72">
                    <Link to={`/mylists/list/1`} className="block">
                    <div className="relative rounded-t-lg pb-80">
                        <img className="absolute inset-0 w-full h-full object-cover rounded-t-lg" src="https://img.freepik.com/free-vector/casting-call-abstract-concept-vector-illustration-open-call-models-commercial-shootings-photo-video-casting-modelling-agency-request-audition-brand-advertising-abstract-metaphor_335657-4165.jpg?w=740&t=st=1704554272~exp=1704554872~hmac=916b3767c735c328a768477449f8909ea9a9f4b65820ad5679fc467150362ba3" alt="List" />
                    </div>
                    </Link>
                    <div className="p-4">
                        <Link to={`/mylists/list/1`} className="block">
                        <h2 className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">Favourites</h2>
                        </Link>
                    </div>
                </div>

                <div className="rounded-lg bg-sky-100 shadow-2xl  max-w-72">
                    <div className="flex items-center justify-center h-full">
                        <Button label={<FaPlus size="6rem"/>} variant="nobg"/>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyLists;
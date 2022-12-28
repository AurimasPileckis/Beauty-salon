import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainContext from '../context/MainContext'
import axios from 'axios'

const NewOrder = () => {

    const { saloonId } = useParams()
    const { setAlert } = useContext(MainContext)
    const [service, setService] = useState([])
    const [workers, setWorkers] = useState([])
    const [form, setForm] = useState({})
    const navigate = useNavigate()

    const handleForm = (e) => {
        setForm({...form, [e.target.name]: e.target.value})

    }

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.post('/api/orders/new/', form)
        .then(resp => {
            setAlert({
                message: resp.data,
                status: 'success'
            })
            navigate('/')
        })
        .catch(error => {
            console.log(error)
            setAlert({
                message: error.response.data,
                status: 'danger'
            })
        })
    }

    useEffect(() => {
        axios.get('/api/services/?saloon=' + saloonId)
        .then(resp => setService(resp.data))
        .catch(error => {
            console.log(error)
            setAlert({
                message: error.response.data,
                status: 'danger'
            })
            if(error.response.status === 401)
                navigate('/login')
        })

    }, [])

    useEffect(() => {
        axios.get('/api/workers/?saloonId' + saloonId)
        .then(resp => setWorkers(resp.data))
        .catch(error => {
            console.log(error)
            setAlert({
                message: error.response.data,
                status: 'danger'
            })
        })
    }, [])
    return (
        <>
           <h1>Naujas užsakymas {saloonId}</h1>
           <form onSubmit={handleSubmit}> 
            <div className='mb-2'>
            <select 
            // onChange={(e) => setServiceId(e.target.value)}
            name='serviceId'
            className='form-control'
            onChange={handleForm}
            >
                <option value='0'>Pasirinkite paslaugą</option>
                {service.map(service => 
                    <option key={service.id} value={service.id}>
                        {service.name + ': ' + 'Trukmė: ' + service.duration}
                    </option>
                    )}
            </select>
            </div>
            <div className='mb-2'>
            <select 
            // onChange={(e) => setServiceId(e.target.value)}
            name='workerId'
            onChange={handleForm}
            className='form-control'
            >
                <option value='0'>Pasirinkite darbuotoją</option>
                {workers.map(worker => 
                    <option key={worker.id} value={worker.id}>
                        {worker.first_name + ' ' + ' ' + worker.last_name}
                    </option>
                    )}
            </select>
            </div>
            <div className='mb-2'>
                <input type='datetime-local'
                       name='order_date'
                       onChange={handleForm}
                       className='form-control'
                 />
            </div>
            <button type='submit'>Užsakyti</button>

           </form>
        </>
    )
}

export default NewOrder

import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import  * as apiClient from './api-clients'
import ManageHotelForm from '../forms/manageHotelForm/ManageHotelForm'

const Edithotel = () => {
    const {hotelId} = useParams()

    const {data: hotel} = useQuery("fetchMyHotelById", ()=> 
        apiClient.fetchMyHotelsById(hotelId || ''),{
            enabled: !!hotelId,
        })
        return <ManageHotelForm hotel={hotel} />
  return (
    <div>
    </div>
  )
}

export default Edithotel

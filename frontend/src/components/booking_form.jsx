//Форма за резервации

import axios from "axios";
import {Navbar} from "./navbar.jsx";
import DatePicker from "react-datepicker";
import {SubmitButton} from "./submit_button.jsx";
import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {Label} from "./labels.jsx";
import {Input} from "./inputs.jsx";

export const BookingForm = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [refresh, setRefresh] = useState(0);
    const [reservedDates, setReservedDates] = useState([]);
    const methods = useForm();


    useEffect(() => {
        const reservedDatesFetch = async () => {
            const fetching = await fetch('http://localhost:8080/reserved-dates');
            if(!fetching.ok) {
                return
            }
            const fetchingData = await fetching.json();
            if (fetchingData) {
                const dateObjects = fetchingData.datesList.map(date => new Date(date));
                setReservedDates(dateObjects);
            } else {
                console.error("No reserved dates found.");
            }
        }
        reservedDatesFetch();
    }, [refresh])



    const handleReservationSubmit = async (data) => {
        const {phoneNumber} = data;
        const startingDate = startDate;
        const endingDate = endDate;
        const phoneNumberRequest = phoneNumber;
        if (startingDate !== undefined && endingDate !== undefined && phoneNumberRequest !== undefined) {
            const response = await axios.post('http://localhost:8080/booking', {
                startingDate,
                endingDate,
                phoneNumberRequest,
            }, {
                withCredentials: true,
            });
            const responseData = response.data;
            console.log("Response Data: ", response.data);
            if (responseData.success === true) {
                alert("Booking successfully reserved!");
                setStartDate(new Date());
                setEndDate(new Date());
                document.getElementById("phoneNumber").value = "";
                setRefresh(prev => prev + 1);
            }
            else if (responseData.success === false) {
                alert("Booking was unsuccessful!")
                setStartDate(new Date());
                setEndDate(new Date());
                document.getElementById("phoneNumber").value = "";
                setRefresh(prev => prev + 1);
            }
        }
        else {
            alert("You need to provide all the information to proceed with booking!")
            setStartDate(new Date());
            setEndDate(new Date());
            document.getElementById("phoneNumber").value = "";
            setRefresh(prev => prev + 1);
        }
    };


    return (
        <>
            <Navbar></Navbar>
            <div className="main_content_wrapper">
                <div className="form_parent">
                  <FormProvider {...methods}>
                    <form className="form" onSubmit={methods.handleSubmit(handleReservationSubmit)}>
                        <p className="form_label">Reservation form</p>
                        <Label htmlFor="startingDatePicker" text={"Starting date"}></Label>
                        <DatePicker
                            selected={startDate}
                            onChange={(startDate) => setStartDate(startDate)}
                            excludeDates={reservedDates}
                            id="startingDatePicker"
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date()}
                        />
                        <Label htmlFor="endDatePicker" text={"Ending date"}></Label>
                        <DatePicker
                            selected={endDate}
                            onChange={(endDate) => setEndDate(endDate)}
                            excludeDates={reservedDates}
                            id="endDatePicker"
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date()}
                        />
                        <Label htmlFor="phoneNumber" text={"Phone number"}></Label>
                        <Input id={"phoneNumber"} type={"text"}></Input>
                        <SubmitButton text={"Reserve"}></SubmitButton>
                    </form>
                  </FormProvider>
                </div>
            </div>
        </>
    );
}
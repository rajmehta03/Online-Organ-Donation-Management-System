import React from 'react';
import {
    CardDeck
} from 'reactstrap';

import CardC from './CardC/CardC';
import registerImg from '../assets/register.jpg';
import searchDonorImg from '../assets/search-donor.png';
import bloodNeededImg from '../assets/blood-needed.jpg';

const CardDeckC = () => {
    return (
        <CardDeck className="mt-3">
            <CardC imageUrl={registerImg}
                imageAlt="Register as organ donor"
                cardTitle="Organ Donor Registration"
                cardText="Have you witnessed someone searching for an organ donor when hospitals say no match available? Every organ donated can save or transform multiple lives. Register today to give the gift of life." 
                buttonUrl="/register"
                buttonText="Register Now"/>
            <CardC imageUrl={searchDonorImg}
                imageAlt="Search Organ Donors"
                cardTitle="Search Organ Donor"
                cardText="Thousands of people need organ transplants to survive. Finding the right match quickly can mean the difference between life and death. Search our database of registered organ donors in your area." 
                buttonUrl="/search-donor"
                buttonText="Search Here"/>

            <CardC imageUrl={bloodNeededImg}
                imageAlt="Organ needed"
                cardTitle="Need Organ"
                cardText="Every 10 minutes, someone is added to the organ transplant waiting list. Your request helps connect you with potential donors. Patients awaiting transplants, accident victims, and those with organ failure need your help to find a match."
                buttonUrl="/need-organ"
                buttonText="Request Organ"/>
        </CardDeck>
    );
}
export default CardDeckC;
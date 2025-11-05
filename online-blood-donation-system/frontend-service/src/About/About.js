import React from 'react';
import classes from './About.module.css';
import TopNavigation, { } from '../Navigation/TopNavigation/TopNavigation';
import {
    Container,
    Row,
    Col
} from 'reactstrap';
import Footer from '../Footer/Footer';
import MediaC from '../MediaC/MediaC';
import bloodDonationImg from '../assets/blood-donation.jpg';
import bloodBankImg from '../assets/blood-bank.jpg';
import bloodTypesImg from '../assets/blood-types.png';
const About = (props) => {
    return (
        <Container>
            <Row>
                <Col>
                    <TopNavigation />
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className={classes.About}>
                        <MediaC image={bloodDonationImg}
                            imageAlt="Organ Donation"
                            heading="Organ Donation"
                            mediaObjectClassName={classes.MediaObject}
                            body="Organ donation is the process when a person allows an organ to be removed, legally, from their body to be transplanted into someone else. Organs can be donated from both living and deceased donors. Living donors can donate a kidney, part of their liver, lung, intestine, or pancreas. Deceased donors can donate kidneys, liver, lungs, heart, pancreas, and intestines. One organ donor can save up to eight lives and enhance many more through tissue donation." />

                        <MediaC image={bloodBankImg}
                            imageAlt="Organ Bank"
                            heading="Organ Donation Registry"
                            mediaObjectClassName={classes.MediaObject}
                            body="An organ donation registry is a database that maintains records of individuals who have consented to donate their organs after death or, in some cases, while living. The registry helps coordinate matches between donors and recipients, ensuring that organs reach patients in need as quickly as possible. Our system facilitates this life-saving process by connecting registered organ donors with patients awaiting transplants, managing critical information about organ type, availability, and compatibility." />

                        <MediaC image={bloodTypesImg}
                            imageAlt="Organ Types"
                            heading="Organ Types and Matching"
                            mediaObjectClassName={classes.MediaObject}
                            body="Organ matching is a complex process that considers multiple factors including blood type, tissue type, organ size, medical urgency, waiting time, and geographic distance. Our system manages various organ types including kidneys, liver, heart, lungs, pancreas, corneas, skin, bone, intestines, and bone marrow. Each organ has specific viability timeframes and matching requirements. The transplant waiting list is maintained by organ type and medical priority, ensuring the most critical patients receive organs first while maximizing the chances of successful transplantation." />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <hr />
                    <Footer />
                </Col>
            </Row>
        </Container>
    );
}

export default About;
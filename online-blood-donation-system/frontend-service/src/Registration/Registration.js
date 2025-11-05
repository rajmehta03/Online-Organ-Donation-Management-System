import React from 'react';
import classes from './Registration.module.css';
import TopNavigation from '../Navigation/TopNavigation/TopNavigation';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
    Container
} from 'reactstrap';
import Footer from '../Footer/Footer';
import { connect } from 'react-redux';
import { bloodDonorRegister } from '../redux/actions/donor/registerDonor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BreadcrumbC from '../BreadcrumbC/BreadcrumbC';
class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payload: {
                firstName: '',
                middleName: '',
                lastName: '',
                gender: '',
                bloodGroup: '',
                bodyWeight: '',
                dob: '',
                emailId: '',
                phoneNumber: '',
                country: '',
                state: '',
                city: '',
                area: '',
                address: '',
                pincode: '',
                organType: '',
                organLifeSpan: '',
                organActive: true,
                organQuantity: 1
            },
            image: '',
            success:'',
            error:'',
            registeredDonor: null,
            showSuccess: false
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);
        
        // Check if hospital is logged in and add hospitalId
        const hospital = localStorage.getItem('hospital');
        let payloadToSend = { ...this.state.payload };
        
        if (hospital) {
            const hospitalData = JSON.parse(hospital);
            payloadToSend.hospitalId = hospitalData.id;
        }
        
        this.props.register(this.state.image, payloadToSend);
        setTimeout(() => {
            this.setState({
                ...this.state,
                payload:{
                    ...this.state.payload
                },
                success: this.props.success,
                error: this.props.error,
                registeredDonor: this.props.bloodDonor,
                showSuccess: this.props.bloodDonor ? true : false
            
            })
            if (this.props.bloodDonor) {
                // Don't reset if successful - show the success page
            } else {
                this.reset();
            }
        }, 1000);
        
    }

    reset = () => {
        this.setState({
            payload: {
                firstName: '',
                middleName: '',
                lastName: '',
                gender: '',
                bloodGroup: '',
                bodyWeight: '',
                dob: '',
                emailId: '',
                phoneNumber: '',
                country: '',
                state: '',
                city: '',
                area: '',
                address: '',
                pincode: '',
                organType: '',
                organLifeSpan: '',
                organActive: true,
                organQuantity: 1
            },
            image: null,
            success:'',
            error:'',
            registeredDonor: null,
            showSuccess: false
        })
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    fileChangeHandler = (e) => {
        this.setState({
            ...this.state,
            payload: {
                ...this.state.payload
            },
            image: e.target.files[0]
        })
    }

    changeHandler = (e) => {
        this.setState({
            ...this.state,
            payload: {
                ...this.state.payload,
                [e.target.name]: e.target.value
            }
        });
    }

    render() {
        const {
            firstName,
            middleName,
            lastName,
            gender,
            bloodGroup,
            bodyWeight,
            dob,
            emailId,
            phoneNumber,
            country,
            state,
            city,
            area,
            address,
            pincode,
            organType,
            organLifeSpan,
            organActive,
            organQuantity
        } = this.state.payload;
        return (
            <>
                <Container>
                    <Row>
                        <Col>
                            <TopNavigation />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2 className={classes.pageHeading}>
                                <FontAwesomeIcon icon="user-plus" /> Join As Organ Donor
                                </h2>
                            <hr />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className={classes.breadCrumb}>
                                <BreadcrumbC />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <div>
                            <Col>
                                {
                                    this.state.error ? alert(this.state.error) : ''
                                }
                            </Col>
                        </div>
                    </Row>
                    {this.state.showSuccess && this.state.registeredDonor ? (
                        <Row>
                            <Col>
                                <div style={{
                                    backgroundColor: '#d4edda',
                                    border: '1px solid #c3e6cb',
                                    borderRadius: '8px',
                                    padding: '30px',
                                    margin: '20px 0',
                                    textAlign: 'center'
                                }}>
                                    <h2 style={{color: '#155724', marginBottom: '20px'}}>
                                        <FontAwesomeIcon icon="user-plus" /> Registration Successful!
                                    </h2>
                                    <div style={{fontSize: '18px', color: '#155724'}}>
                                        <p><strong>Thank you for registering as an organ donor!</strong></p>
                                        <p style={{fontSize: '24px', margin: '20px 0'}}>
                                            Your Donor ID: <strong style={{color: '#28a745'}}>{this.state.registeredDonor.id}</strong>
                                        </p>
                                        <p><strong>Name:</strong> {this.state.registeredDonor.firstName} {this.state.registeredDonor.lastName}</p>
                                        {this.state.registeredDonor.organType && (
                                            <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '5px'}}>
                                                <h4 style={{color: '#28a745'}}>Organ Details:</h4>
                                                <p><strong>Organ Type:</strong> {this.state.registeredDonor.organType}</p>
                                                <p><strong>Quantity Available:</strong> {this.state.registeredDonor.organQuantity}</p>
                                                <p><strong>Status:</strong> {this.state.registeredDonor.organActive ? '✓ Active' : 'Inactive'}</p>
                                                <p><strong>Life Span:</strong> {this.state.registeredDonor.organLifeSpan || 'N/A'}</p>
                                            </div>
                                        )}
                                        <div style={{marginTop: '20px'}}>
                                            <button 
                                                className="btn btn-success btn-lg"
                                                onClick={this.reset}
                                                style={{marginRight: '10px'}}>
                                                Register Another Donor
                                            </button>
                                            <button 
                                                className="btn btn-primary btn-lg"
                                                onClick={() => window.location.href = '/donor-requests'}>
                                                View My Requests
                                            </button>
                                        </div>
                                        <p style={{marginTop: '20px', fontSize: '14px', color: '#666'}}>
                                            <em>Please save your Donor ID for future reference.</em>
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    ) : (
                    <>
                    <Row>
                        <Col>
                            <h3 className={classes.formHeading}>
                                <FontAwesomeIcon icon="user-plus" /> Register As Organ Donor
                            </h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div>
                                <Form className={classes.form} onSubmit={this.handleSubmit}>
                                    <Row form>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="firstName" className={classes.Label}>First Name</Label>
                                                <Input type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    placeholder="Enter your first name"
                                                    required
                                                    onChange={this.changeHandler}
                                                    value={firstName} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="middleName" className={classes.middle}>Middle Name</Label>
                                                <Input type="text"
                                                    id="middleName"
                                                    name="middleName"
                                                    placeholder="Enter your middle name"
                                                    onChange={this.changeHandler}
                                                    value={middleName} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="lastName" className={classes.last}>Last Name</Label>
                                                <Input type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    placeholder="Enter your last name"
                                                    onChange={this.changeHandler}
                                                    value={lastName} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row form>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="gender" className={classes.Label}>Gender</Label>
                                                <Input type="select" name="gender" id="gender" required onChange={this.changeHandler} value={gender}>
                                                    <option value="">Select gender</option>
                                                    <option value="M">Male</option>
                                                    <option value="F">Female</option>
                                                    <option value="O">Other</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="bloodGroup" className={classes.Label}>Blood Group</Label>
                                                <Input type="select" name="bloodGroup" id="bloodGroup" required onChange={this.changeHandler} value={bloodGroup}>
                                                    <option value="">Select Blood Group</option>
                                                    <option value="A+">A+</option>
                                                    <option value="A-">A-</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B-">B-</option>
                                                    <option value="O+">O+</option>
                                                    <option value="O-">O-</option>
                                                    <option value="AB+">AB+</option>
                                                    <option value="AB-">AB-</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="bodyWeight" className={classes.Label}>Body Weight(Kg)</Label>
                                                <Input type="text"
                                                    id="bodyWeight"
                                                    name="bodyWeight"
                                                    placeholder="Enter your body weight"
                                                    required
                                                    onChange={this.changeHandler}
                                                    value={bodyWeight} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row form>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="organType" className={classes.Label}>Organ Type</Label>
                                                <Input type="select" name="organType" id="organType" onChange={this.changeHandler} value={organType}>
                                                    <option value="">Select Organ Type</option>
                                                    <option value="KIDNEY">Kidney</option>
                                                    <option value="LIVER">Liver</option>
                                                    <option value="HEART">Heart</option>
                                                    <option value="LUNG">Lung</option>
                                                    <option value="PANCREAS">Pancreas</option>
                                                    <option value="CORNEA">Cornea</option>
                                                    <option value="SKIN">Skin</option>
                                                    <option value="BONE">Bone</option>
                                                    <option value="INTESTINE">Intestine</option>
                                                    <option value="BONE_MARROW">Bone Marrow</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="organLifeSpan" className={classes.Label}>Organ Life Span</Label>
                                                <Input type="text"
                                                    id="organLifeSpan"
                                                    name="organLifeSpan"
                                                    placeholder="e.g., 6 hours, 24 hours"
                                                    onChange={this.changeHandler}
                                                    value={organLifeSpan} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={2}>
                                            <FormGroup>
                                                <Label for="organActive" className={classes.Label}>Organ Active</Label>
                                                <Input type="select" name="organActive" id="organActive"
                                                    onChange={(e) => this.setState({
                                                        ...this.state,
                                                        payload: {...this.state.payload, organActive: e.target.value === 'true'}
                                                    })} value={organActive}>
                                                    <option value="true">Yes</option>
                                                    <option value="false">No</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={2}>
                                            <FormGroup>
                                                <Label for="organQuantity" className={classes.Label}>Quantity</Label>
                                                <Input type="number"
                                                    id="organQuantity"
                                                    name="organQuantity"
                                                    min="1"
                                                    onChange={this.changeHandler}
                                                    value={organQuantity} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row form>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="dob" className={classes.Label}>DOB</Label>
                                                <Input type="date"
                                                    id="dob"
                                                    name="dob"
                                                    placeholder="Enter your date of birth in yyyy-MM-dd format"
                                                    onBlur={this.BlurEvent}
                                                    required
                                                    onChange={this.changeHandler}
                                                    value={dob} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="email" className={classes.Label}>Email ID</Label>
                                                <Input type="email"
                                                    id="email"
                                                    name="emailId"
                                                    placeholder="Enter your emai id"
                                                    required
                                                    onChange={this.changeHandler}
                                                    value={emailId} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="phone" className={classes.Label}>Phone Number</Label>
                                                <Input type="text"
                                                    id="phone"
                                                    name="phoneNumber"
                                                    placeholder="Enter your phone number"
                                                    required
                                                    onChange={this.changeHandler}
                                                    value={phoneNumber} />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row form>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="country" className={classes.Label}>Country</Label>
                                                <Input type="text"
                                                    id="country"
                                                    name="country"
                                                    placeholder="Enter country name"
                                                    required
                                                    onChange={this.changeHandler}
                                                    value={country} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="state" className={classes.Label}>State</Label>
                                                <Input type="text"
                                                    id="state"
                                                    name="state"
                                                    placeholder="Enter state name"
                                                    required
                                                    onChange={this.changeHandler}
                                                    value={state} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="city" className={classes.Label}>City</Label>
                                                <Input type="text"
                                                    id="city"
                                                    name="city"
                                                    placeholder="Enter city name"
                                                    required
                                                    onChange={this.changeHandler}
                                                    value={city} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="area" className={classes.Label}>Area</Label>
                                                <Input type="text"
                                                    id="area"
                                                    name="area"
                                                    placeholder="Enter area name"
                                                    required
                                                    onChange={this.changeHandler}
                                                    value={area} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="address" className={classes.Label}>Compelete Address</Label>
                                                <Input type="textarea"
                                                    id="address"
                                                    name="address"
                                                    placeholder="Enter your address"
                                                    rows="3"
                                                    required
                                                    onChange={this.changeHandler}
                                                    value={address} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="pincode" className={classes.Label}>Pincode</Label>
                                                <Input type="text"
                                                    id="pincode"
                                                    name="pincode"
                                                    placeholder="Enter your pincode"
                                                    required
                                                    onChange={this.changeHandler}
                                                    value={pincode} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="photo" className={classes.Label}>Upload Photo</Label>
                                                <Input type="file"
                                                    id="photo"
                                                    name="image"
                                                    onChange={this.fileChangeHandler}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <FormGroup>
                                        <Input type="submit"
                                            value="Submit"
                                            className="btn-lg btn-danger" />
                                    </FormGroup>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                    </>
                    )}
                    <Row>
                        <Col>
                            <hr />
                            <Footer />
                        </Col>
                    </Row>
                </Container>

            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        success: state.registerDonor.success,
        error: state.registerDonor.error,
        bloodDonor: state.registerDonor.bloodDonor
    }
}

const mapDispatchToProps = disptach => {
    return {
        register: (image, request) => disptach(bloodDonorRegister(image, request))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
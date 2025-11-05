import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { hospitalRegister } from '../redux/actions/hospital/hospitalActions';
import TopNavigation from '../Navigation/TopNavigation/TopNavigation';
import Footer from '../Footer/Footer';
import classes from './HospitalSignup.module.css';

class HospitalSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hospitalName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            address: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            licenseNumber: '',
            contactPerson: '',
            error: '',
            loading: false,
            passwordMismatch: false
        };
    }

    handleChange = (e) => {
        this.setState({ 
            [e.target.name]: e.target.value,
            error: '',
            passwordMismatch: false
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { password, confirmPassword } = this.state;

        if (password !== confirmPassword) {
            this.setState({ passwordMismatch: true, error: 'Passwords do not match' });
            return;
        }

        this.setState({ loading: true, error: '' });

        const hospitalData = {
            hospitalName: this.state.hospitalName,
            email: this.state.email,
            password: this.state.password,
            phoneNumber: this.state.phoneNumber,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            country: this.state.country,
            pincode: this.state.pincode,
            licenseNumber: this.state.licenseNumber,
            contactPerson: this.state.contactPerson
        };

        this.props.register(hospitalData);
    }

    componentDidUpdate(prevProps) {
        if (this.props.error && this.props.error !== prevProps.error) {
            this.setState({ error: this.props.error, loading: false });
        }
        if (this.props.hospital && !prevProps.hospital) {
            // Registration successful - redirect to login
            this.props.history.push('/hospital-login');
        }
    }

    render() {
        return (
            <>
                <TopNavigation />
                <Container className={classes.signupContainer}>
                    <Row className="justify-content-center">
                        <Col md="8" lg="6">
                            <Card className={classes.signupCard}>
                                <CardBody>
                                    <h3 className="text-center mb-4">Hospital Registration</h3>
                                    {this.state.error && <Alert color="danger">{this.state.error}</Alert>}
                                    <Form onSubmit={this.handleSubmit}>
                                        <FormGroup>
                                            <Label for="hospitalName">Hospital Name *</Label>
                                            <Input
                                                type="text"
                                                name="hospitalName"
                                                id="hospitalName"
                                                value={this.state.hospitalName}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="email">Email *</Label>
                                            <Input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={this.state.email}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="password">Password *</Label>
                                            <Input
                                                type="password"
                                                name="password"
                                                id="password"
                                                value={this.state.password}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="confirmPassword">Confirm Password *</Label>
                                            <Input
                                                type="password"
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                value={this.state.confirmPassword}
                                                onChange={this.handleChange}
                                                invalid={this.state.passwordMismatch}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="licenseNumber">License Number *</Label>
                                            <Input
                                                type="text"
                                                name="licenseNumber"
                                                id="licenseNumber"
                                                value={this.state.licenseNumber}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="contactPerson">Contact Person *</Label>
                                            <Input
                                                type="text"
                                                name="contactPerson"
                                                id="contactPerson"
                                                value={this.state.contactPerson}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="phoneNumber">Phone Number *</Label>
                                            <Input
                                                type="text"
                                                name="phoneNumber"
                                                id="phoneNumber"
                                                value={this.state.phoneNumber}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="address">Address *</Label>
                                            <Input
                                                type="text"
                                                name="address"
                                                id="address"
                                                value={this.state.address}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </FormGroup>
                                        <Row>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label for="city">City *</Label>
                                                    <Input
                                                        type="text"
                                                        name="city"
                                                        id="city"
                                                        value={this.state.city}
                                                        onChange={this.handleChange}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label for="state">State *</Label>
                                                    <Input
                                                        type="text"
                                                        name="state"
                                                        id="state"
                                                        value={this.state.state}
                                                        onChange={this.handleChange}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label for="country">Country *</Label>
                                                    <Input
                                                        type="text"
                                                        name="country"
                                                        id="country"
                                                        value={this.state.country}
                                                        onChange={this.handleChange}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label for="pincode">Pincode *</Label>
                                                    <Input
                                                        type="text"
                                                        name="pincode"
                                                        id="pincode"
                                                        value={this.state.pincode}
                                                        onChange={this.handleChange}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button 
                                            color="primary" 
                                            block 
                                            type="submit"
                                            disabled={this.state.loading}
                                        >
                                            {this.state.loading ? 'Registering...' : 'Register Hospital'}
                                        </Button>
                                    </Form>
                                    <div className="text-center mt-3">
                                        <a href="/hospital-login">Already registered? Login here</a>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    hospital: state.hospital.hospital,
    error: state.hospital.error
});

const mapDispatchToProps = (dispatch) => ({
    register: (hospitalData) => dispatch(hospitalRegister(hospitalData))
});

export default connect(mapStateToProps, mapDispatchToProps)(HospitalSignup);

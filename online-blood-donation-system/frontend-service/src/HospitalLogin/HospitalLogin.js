import React, { Component } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TopNavigation from '../Navigation/TopNavigation/TopNavigation';
import Footer from '../Footer/Footer';
import { hospitalLogin } from '../redux/actions/hospital/hospitalActions';
import classes from './HospitalLogin.module.css';

class HospitalLogin extends Component {
    state = {
        email: '',
        password: '',
        error: '',
        loading: false
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true, error: '' });
        
        const { email, password } = this.state;
        this.props.login({ email, password });
    };

    componentDidUpdate(prevProps) {
        if (this.props.error && this.props.error !== prevProps.error) {
            this.setState({ error: this.props.error, loading: false });
        }
        if (this.props.hospital && !prevProps.hospital) {
            // Login successful - store in localStorage and redirect
            localStorage.setItem('hospital', JSON.stringify(this.props.hospital));
            localStorage.setItem('token', this.props.hospital.token);
            window.location.href = '/organ-inventory';
        }
    }

    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Col>
                            <TopNavigation />
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col md={{ size: 6, offset: 3 }}>
                            <div className={classes.loginContainer}>
                                <h2 className="text-center mb-4">Hospital Login</h2>
                                {this.state.error && (
                                    <Alert color="danger">{this.state.error}</Alert>
                                )}
                                <Form onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="password">Password</Label>
                                        <Input
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="Enter your password"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </FormGroup>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        block
                                        disabled={this.state.loading}
                                    >
                                        {this.state.loading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <p>
                                        Don't have an account?{' '}
                                        <Link to="/hospital-signup">Sign Up</Link>
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Footer />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    hospital: state.hospital.hospital,
    error: state.hospital.error
});

const mapDispatchToProps = (dispatch) => ({
    login: (credentials) => dispatch(hospitalLogin(credentials))
});

export default connect(mapStateToProps, mapDispatchToProps)(HospitalLogin);

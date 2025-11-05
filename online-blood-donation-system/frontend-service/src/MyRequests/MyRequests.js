import React, { Component } from 'react';
import {
    Container, Row, Col, Card, CardBody, CardHeader, Button, Alert,
    Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Badge
} from 'reactstrap';
import { getRequestsByEmail, updateRecipient } from '../service/bloodRecipientService';
import TopNavigation from '../Navigation/TopNavigation/TopNavigation';
import Footer from '../Footer/Footer';
import classes from './MyRequests.module.css';

class MyRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            loading: true,
            error: null,
            success: null,
            email: '',
            modalOpen: true,
            rejectModalOpen: false,
            selectedRequest: null,
            rejectReason: ''
        };
    }

    loadRequests = () => {
        const { email } = this.state;
        if (!email) return;

        this.setState({ loading: true, error: null });
        
        getRequestsByEmail(email)
            .then(response => {
                this.setState({
                    requests: response.data,
                    loading: false,
                    modalOpen: false
                });
            })
            .catch(error => {
                console.error('Error fetching requests:', error);
                this.setState({
                    error: 'Failed to load your requests. Please check your email and try again.',
                    loading: false
                });
            });
    }

    handleEmailSubmit = () => {
        const { email } = this.state;
        if (email && email.trim() !== '' && email.includes('@')) {
            this.loadRequests();
        } else {
            alert('Please enter a valid email address');
        }
    }

    openRejectModal = (request) => {
        this.setState({
            selectedRequest: request,
            rejectModalOpen: true,
            rejectReason: ''
        });
    }

    handleApprove = (request) => {
        if (window.confirm(`Are you sure you want to approve request #${request.id}?`)) {
            updateRecipient(request.id, 'COMPLETED', 'Request approved')
                .then(response => {
                    this.setState({
                        success: `Request #${request.id} has been approved successfully.`,
                        error: null
                    });
                    
                    // Reload requests
                    this.loadRequests();
                    
                    // Clear success message after 5 seconds
                    setTimeout(() => {
                        this.setState({ success: null });
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error approving request:', error);
                    this.setState({
                        error: 'Failed to approve request. Please try again.',
                        success: null
                    });
                });
        }
    }

    handleReject = () => {
        const { selectedRequest, rejectReason } = this.state;
        
        if (!rejectReason || rejectReason.trim() === '') {
            alert('Please provide a reason for declining this request');
            return;
        }

        updateRecipient(selectedRequest.id, 'REJECTED', rejectReason)
            .then(response => {
                this.setState({
                    success: `Request #${selectedRequest.id} has been declined.`,
                    error: null,
                    rejectModalOpen: false,
                    selectedRequest: null,
                    rejectReason: ''
                });
                
                // Reload requests
                this.loadRequests();
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    this.setState({ success: null });
                }, 5000);
            })
            .catch(error => {
                console.error('Error rejecting request:', error);
                this.setState({
                    error: 'Failed to decline request. Please try again.',
                    success: null
                });
            });
    }

    getStatusBadgeColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'ACKNOWLEDGED':
                return 'info';
            case 'COMPLETED':
                return 'success';
            case 'REJECTED':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    render() {
        const { requests, loading, error, success, email, modalOpen, rejectModalOpen, rejectReason } = this.state;

        return (
            <>
                <TopNavigation />
                <Container className={classes.container}>
                    <Modal isOpen={modalOpen} toggle={() => this.setState({ modalOpen: !modalOpen })}>
                        <ModalHeader toggle={() => this.setState({ modalOpen: !modalOpen })}>
                            Enter Your Email
                        </ModalHeader>
                        <ModalBody>
                            <Label for="email">Email Address:</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => this.setState({ email: e.target.value })}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        this.handleEmailSubmit();
                                    }
                                }}
                            />
                            <small className="text-muted">
                                Enter the email you used when submitting your organ request.
                            </small>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.handleEmailSubmit}>
                                Load My Requests
                            </Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={rejectModalOpen} toggle={() => this.setState({ rejectModalOpen: false })}>
                        <ModalHeader toggle={() => this.setState({ rejectModalOpen: false })}>
                            Decline Request
                        </ModalHeader>
                        <ModalBody>
                            <Label for="rejectReason">Reason for Declining:</Label>
                            <Input
                                type="textarea"
                                name="rejectReason"
                                id="rejectReason"
                                rows="4"
                                placeholder="Please provide a reason for declining this request..."
                                value={rejectReason}
                                onChange={(e) => this.setState({ rejectReason: e.target.value })}
                            />
                            <small className="text-muted">
                                This reason will be recorded and may be shared with relevant parties.
                            </small>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={() => this.setState({ rejectModalOpen: false })}>
                                Cancel
                            </Button>
                            <Button color="danger" onClick={this.handleReject}>
                                Confirm Decline
                            </Button>
                        </ModalFooter>
                    </Modal>

                    <Row className="mt-5">
                        <Col>
                            <h2 className={classes.pageHeading}>My Organ Requests</h2>
                            <hr />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card className={classes.card}>
                                <CardHeader className={classes.cardHeader}>
                                    <h4>Your Submitted Requests</h4>
                                    <p className="mb-0">
                                        Email: <strong>{email}</strong>
                                        {' '}
                                        <Button 
                                            color="link" 
                                            size="sm" 
                                            onClick={() => this.setState({ modalOpen: true })}
                                        >
                                            Change Email
                                        </Button>
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => this.setState({ error: null })}>
                                            {error}
                                        </Alert>
                                    )}
                                    
                                    {success && (
                                        <Alert color="success" toggle={() => this.setState({ success: null })}>
                                            {success}
                                        </Alert>
                                    )}

                                    {loading ? (
                                        <div className="text-center py-5">
                                            <p>Loading your requests...</p>
                                        </div>
                                    ) : requests.length === 0 ? (
                                        <Alert color="info">
                                            No organ requests found for this email address.
                                        </Alert>
                                    ) : (
                                        <div className={classes.tableWrapper}>
                                            {requests.map((request) => (
                                                <Card key={request.id} className={classes.requestCard}>
                                                    <CardHeader className={classes.requestHeader}>
                                                        <Row>
                                                            <Col md={8}>
                                                                <h5>Request #{request.id} - {request.patientName}</h5>
                                                                <Badge color={this.getStatusBadgeColor(request.status)} className="mr-2">
                                                                    {request.status}
                                                                </Badge>
                                                                {request.approvalStatus && (
                                                                    <Badge color={request.approvalStatus === 'APPROVED' ? 'success' : 'danger'}>
                                                                        {request.approvalStatus}
                                                                    </Badge>
                                                                )}
                                                            </Col>
                                                            <Col md={4} className="text-right">
                                                                <small className="text-muted">
                                                                    Submitted: {request.date}
                                                                </small>
                                                            </Col>
                                                        </Row>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col md={6}>
                                                                <h6>Patient Information</h6>
                                                                <p><strong>Name:</strong> {request.patientName}</p>
                                                                <p><strong>Gender:</strong> {request.gender}</p>
                                                                <p><strong>Blood Group:</strong> {request.requiredBloodGroup || 'N/A'}</p>
                                                                <p><strong>When Required:</strong> {request.date}</p>
                                                            </Col>
                                                            <Col md={6}>
                                                                <h6>Organ Requirements</h6>
                                                                <p><strong>Organ Type:</strong> <Badge color="primary">{request.requiredOrganType || 'Blood'}</Badge></p>
                                                                <p><strong>Quantity Required:</strong> {request.organQuantityRequired || request.bloodUnit || 'N/A'}</p>
                                                                <p><strong>Reason:</strong> {request.reason}</p>
                                                            </Col>
                                                        </Row>
                                                        <Row className="mt-3">
                                                            <Col md={6}>
                                                                <h6>Hospital Details</h6>
                                                                <p><strong>Hospital:</strong> {request.hospitalName}</p>
                                                                <p><strong>Location:</strong> {request.city}, {request.pincode}</p>
                                                            </Col>
                                                            <Col md={6}>
                                                                <h6>Contact Information</h6>
                                                                <p><strong>Contact Person:</strong> {request.contactName}</p>
                                                                <p><strong>Email:</strong> {request.emailId}</p>
                                                                <p><strong>Phone:</strong> {request.phoneNumber}</p>
                                                            </Col>
                                                        </Row>
                                                        {request.comment && (
                                                            <Row className="mt-3">
                                                                <Col>
                                                                    <Alert color="warning">
                                                                        <strong>Comment/Reason:</strong> {request.comment}
                                                                    </Alert>
                                                                </Col>
                                                            </Row>
                                                        )}
                                                        {request.approvalDate && (
                                                            <Row className="mt-2">
                                                                <Col>
                                                                    <p className="text-muted">
                                                                        <strong>Action Date:</strong> {request.approvalDate}
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        )}
                                                        <Row className="mt-3">
                                                            <Col md={6}>
                                                                <div>
                                                                    <h6>Prescription Photo</h6>
                                                                    <img 
                                                                        src={`http://localhost:8080/api/v1/recipient/${request.id}/prescription`}
                                                                        alt="Prescription"
                                                                        className={classes.prescriptionImage}
                                                                        style={{maxWidth: '100%', maxHeight: '300px', border: '2px solid #ddd', borderRadius: '8px', padding: '5px', cursor: 'pointer'}}
                                                                        onClick={() => window.open(`http://localhost:8080/api/v1/recipient/${request.id}/prescription`, '_blank')}
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'block';
                                                                        }}
                                                                    />
                                                                    <p className="text-muted" style={{fontSize: '12px', display: 'none'}}>No prescription image available</p>
                                                                    <p className="text-muted mt-2" style={{fontSize: '12px'}}>Click image to view full size</p>
                                                                </div>
                                                            </Col>
                                                            <Col md={6} className="text-right">
                                                                {request.status === 'PENDING' && (
                                                                    <div>
                                                                        <Button
                                                                            color="success"
                                                                            className="mr-2"
                                                                            onClick={() => this.handleApprove(request)}
                                                                        >
                                                                            Approve
                                                                        </Button>
                                                                        <Button
                                                                            color="danger"
                                                                            onClick={() => this.openRejectModal(request)}
                                                                        >
                                                                            Decline
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            ))}
                                        </div>
                                    )}

                                    <div className="text-center mt-4">
                                        <Button color="primary" onClick={this.loadRequests}>
                                            <span>↻</span> Refresh Requests
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    
                    <Row className="mt-4">
                        <Col>
                            <Footer />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default MyRequests;

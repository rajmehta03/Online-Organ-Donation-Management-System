import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, Table, Button, Alert,
    Modal, ModalHeader, ModalBody, ModalFooter, Input, Label
} from 'reactstrap';
import { getMatchingRequests, approveRequest } from '../service/bloodDonorService';
import './DonorRequests.css';

class DonorRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            loading: true,
            error: null,
            success: null,
            donorId: '',
            modalOpen: false,
            selectedRequest: null,
            donorInfo: null
        };
    }

    componentDidMount() {
        // In a real application, you would get the donor ID from authentication/session
        // For now, we'll ask the user to enter it
        this.setState({ modalOpen: true });
    }

    loadRequests = () => {
        const { donorId } = this.state;
        if (!donorId) return;

        this.setState({ loading: true, error: null });
        
        // First get donor info
        import('../service/bloodDonorService').then(service => {
            service.getDonor(donorId)
                .then(donorResponse => {
                    this.setState({ donorInfo: donorResponse.data });
                    
                    // Then get matching requests
                    getMatchingRequests(donorId)
                        .then(response => {
                            this.setState({
                                requests: response.data,
                                loading: false
                            });
                        })
                        .catch(error => {
                            console.error('Error fetching requests:', error);
                            this.setState({
                                error: 'Failed to load matching requests. Please try again.',
                                loading: false
                            });
                        });
                })
                .catch(error => {
                    console.error('Error fetching donor info:', error);
                    this.setState({
                        error: 'Invalid Donor ID. Please check and try again.',
                        loading: false,
                        donorInfo: null
                    });
                });
        });
    }

    handleApprove = (request) => {
        const { donorId, donorInfo } = this.state;
        
        // Check if donor has enough organs
        if (donorInfo && request.requiredOrganType) {
            if (donorInfo.organType !== request.requiredOrganType) {
                this.setState({
                    error: `You cannot approve this request. Your organ type (${donorInfo.organType}) does not match the required type (${request.requiredOrganType}).`,
                    success: null
                });
                return;
            }
            
            if (donorInfo.organQuantity < request.organQuantityRequired) {
                this.setState({
                    error: `Insufficient organ quantity. You have ${donorInfo.organQuantity}, but ${request.organQuantityRequired} required.`,
                    success: null
                });
                return;
            }
        }
        
        if (window.confirm(`Are you sure you want to ACCEPT this request for ${request.patientName}?`)) {
            approveRequest(request.id, donorId)
                .then(response => {
                    this.setState({
                        success: `Request accepted successfully for ${request.patientName}!`,
                        error: null
                    });
                    // Reload requests after approval
                    this.loadRequests();
                    
                    // Clear success message after 5 seconds
                    setTimeout(() => {
                        this.setState({ success: null });
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error approving request:', error);
                    const errorMessage = error.response?.data?.userMessage || 
                                       'Failed to approve request. You may not have enough organs available.';
                    this.setState({
                        error: errorMessage,
                        success: null
                    });
                });
        }
    }

    handleReject = (request) => {
        if (window.confirm(`Are you sure you want to REJECT this request for ${request.patientName}?`)) {
            this.setState({
                success: `Request for ${request.patientName} has been rejected.`,
                error: null
            });
            
            // Remove from list
            const updatedRequests = this.state.requests.filter(r => r.id !== request.id);
            this.setState({ requests: updatedRequests });
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                this.setState({ success: null });
            }, 3000);
        }
    }

    handleDonorIdSubmit = () => {
        const { donorId } = this.state;
        if (donorId && donorId.trim() !== '') {
            this.setState({ modalOpen: false });
            this.loadRequests();
        } else {
            alert('Please enter a valid Donor ID');
        }
    }

    render() {
        const { requests, loading, error, success, donorId, modalOpen, donorInfo } = this.state;

        return (
            <div className="donor-requests-container">
                <Modal isOpen={modalOpen} toggle={() => this.setState({ modalOpen: !modalOpen })}>
                    <ModalHeader toggle={() => this.setState({ modalOpen: !modalOpen })}>
                        Enter Your Donor ID
                    </ModalHeader>
                    <ModalBody>
                        <Label for="donorId">Donor ID:</Label>
                        <Input
                            type="number"
                            name="donorId"
                            id="donorId"
                            placeholder="Enter your donor ID"
                            value={donorId}
                            onChange={(e) => this.setState({ donorId: e.target.value })}
                        />
                        <small className="text-muted">
                            Note: You received your donor ID when you registered as a donor.
                        </small>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleDonorIdSubmit}>
                            Load My Requests
                        </Button>
                    </ModalFooter>
                </Modal>

                <Card className="donor-requests-card">
                    <CardHeader className="text-center">
                        <h3>Organ Donation Requests Matching Your Profile</h3>
                        <p className="text-muted">
                            {donorId && `Donor ID: ${donorId}`}
                            {' '}
                            <Button 
                                color="link" 
                                size="sm" 
                                onClick={() => this.setState({ modalOpen: true })}
                            >
                                Change ID
                            </Button>
                        </p>
                        {donorInfo && donorInfo.organType && (
                            <div style={{
                                backgroundColor: '#d4edda',
                                padding: '15px',
                                borderRadius: '5px',
                                margin: '10px auto',
                                maxWidth: '600px'
                            }}>
                                <strong>Your Organ Availability:</strong>
                                <p style={{margin: '5px 0'}}>
                                    Organ Type: <strong style={{color: '#28a745'}}>{donorInfo.organType}</strong>
                                    {' | '}
                                    Available Quantity: <strong>{donorInfo.organQuantity}</strong>
                                    {' | '}
                                    Status: {donorInfo.organActive ? <span style={{color: 'green'}}>✓ Active</span> : <span style={{color: 'red'}}>Inactive</span>}
                                </p>
                            </div>
                        )}
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
                            <div className="text-center">
                                <p>Loading requests...</p>
                            </div>
                        ) : requests.length === 0 ? (
                            <Alert color="info">
                                No matching organ donation requests found in your area at this time.
                            </Alert>
                        ) : (
                            <div className="table-responsive">
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>Request ID</th>
                                            <th>Patient Name</th>
                                            <th>Gender</th>
                                            <th>Organ Type</th>
                                            <th>Qty Required</th>
                                            <th>Match Status</th>
                                            <th>Hospital</th>
                                            <th>City</th>
                                            <th>Contact</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map(request => {
                                            const canFulfill = donorInfo && request.requiredOrganType ? 
                                                (donorInfo.organType === request.requiredOrganType && 
                                                 donorInfo.organQuantity >= request.organQuantityRequired &&
                                                 donorInfo.organActive) : true;
                                            
                                            return (
                                            <tr key={request.id} style={{backgroundColor: canFulfill ? '#f8fff9' : '#fff8f8'}}>
                                                <td>{request.id}</td>
                                                <td>{request.patientName}</td>
                                                <td>{request.gender}</td>
                                                <td>
                                                    <strong>{request.requiredOrganType || request.requiredBloodGroup || 'N/A'}</strong>
                                                </td>
                                                <td>
                                                    <strong>{request.organQuantityRequired || request.bloodUnit || 'N/A'}</strong>
                                                </td>
                                                <td>
                                                    {canFulfill ? (
                                                        <span style={{color: 'green', fontWeight: 'bold'}}>✓ Can Fulfill</span>
                                                    ) : (
                                                        <span style={{color: 'red', fontWeight: 'bold'}}>✗ Cannot Fulfill</span>
                                                    )}
                                                </td>
                                                <td>{request.hospitalName}</td>
                                                <td>{request.city}</td>
                                                <td>
                                                    <div>
                                                        <small>{request.contactName}</small><br />
                                                        <small>{request.phoneNumber}</small>
                                                    </div>
                                                </td>
                                                <td>{request.date}</td>
                                                <td>
                                                    <span className={`badge badge-${request.status === 'PENDING' ? 'warning' : 'success'}`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {request.status === 'PENDING' && (
                                                        <div>
                                                            <Button
                                                                color="success"
                                                                size="sm"
                                                                onClick={() => this.handleApprove(request)}
                                                                disabled={!canFulfill}
                                                                title={!canFulfill ? 'You cannot fulfill this request' : 'Accept this request'}
                                                                style={{marginRight: '5px', marginBottom: '5px'}}>
                                                                ✓ Accept
                                                            </Button>
                                                            <Button
                                                                color="danger"
                                                                size="sm"
                                                                onClick={() => this.handleReject(request)}
                                                                title="Reject this request">
                                                                ✗ Reject
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {request.approvalStatus === 'APPROVED' && (
                                                        <span className="text-success">✓ Accepted</span>
                                                    )}
                                                </td>
                                            </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        <div className="text-center mt-3">
                            <Button color="primary" onClick={this.loadRequests}>
                                Refresh Requests
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default DonorRequests;

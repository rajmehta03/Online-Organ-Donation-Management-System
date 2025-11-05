import React from 'react';
import { connect } from 'react-redux';
import { Container, Card, CardBody, CardTitle, Table, Badge, Nav, NavItem, NavLink, TabContent, TabPane, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import { fetchHospitalRequestsMade, fetchHospitalRequestsReceived } from '../redux/actions/hospital/hospitalActions';
import { approveRequest } from '../service/bloodDonorService';
import { rejectRequest as rejectRecipientRequest } from '../service/bloodRecipientService';
import TopNavigation from '../Navigation/TopNavigation/TopNavigation';
import Footer from '../Footer/Footer';
import classes from './HospitalRequests.module.css';

class HospitalRequests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            rejectModalOpen: false,
            selectedRequest: null,
            rejectReason: '',
            successMessage: '',
            errorMessage: ''
        };
    }

    componentDidMount() {
        const hospital = JSON.parse(localStorage.getItem('hospital'));
        if (!hospital || !hospital.id) {
            this.props.history.push('/hospital-login');
            return;
        }
        this.props.fetchRequestsMade(hospital.id);
        this.props.fetchRequestsReceived(hospital.id);
    }

    toggleTab = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab });
        }
    }

    openRejectModal = (request) => {
        this.setState({
            rejectModalOpen: true,
            selectedRequest: request,
            rejectReason: ''
        });
    }

    closeRejectModal = () => {
        this.setState({
            rejectModalOpen: false,
            selectedRequest: null,
            rejectReason: ''
        });
    }

    handleApprove = (request) => {
        const hospital = JSON.parse(localStorage.getItem('hospital'));
        if (!hospital || !hospital.id) {
            this.setState({ errorMessage: 'Please login to approve requests' });
            return;
        }

        if (window.confirm(`Are you sure you want to approve this request for ${request.patientName}?`)) {
            approveRequest(request.id, hospital.id)
                .then(response => {
                    this.setState({ 
                        successMessage: `Request for ${request.patientName} has been approved successfully.`,
                        errorMessage: ''
                    });
                    // Refresh the requests
                    this.props.fetchRequestsReceived(hospital.id);
                    // Clear success message after 5 seconds
                    setTimeout(() => {
                        this.setState({ successMessage: '' });
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error approving request:', error);
                    this.setState({ 
                        errorMessage: 'Failed to approve request. Please try again.',
                        successMessage: ''
                    });
                });
        }
    }

    handleReject = () => {
        const { selectedRequest, rejectReason } = this.state;
        
        if (!rejectReason || rejectReason.trim() === '') {
            alert('Please provide a reason for rejecting this request');
            return;
        }

        rejectRecipientRequest(selectedRequest.id, rejectReason)
            .then(response => {
                this.setState({ 
                    successMessage: `Request for ${selectedRequest.patientName} has been rejected.`,
                    errorMessage: '',
                    rejectModalOpen: false,
                    selectedRequest: null,
                    rejectReason: ''
                });
                // Refresh the requests
                const hospital = JSON.parse(localStorage.getItem('hospital'));
                this.props.fetchRequestsReceived(hospital.id);
                // Clear success message after 5 seconds
                setTimeout(() => {
                    this.setState({ successMessage: '' });
                }, 5000);
            })
            .catch(error => {
                console.error('Error rejecting request:', error);
                this.setState({ 
                    errorMessage: 'Failed to reject request. Please try again.',
                    successMessage: ''
                });
            });
    }

    render() {
        const { requestsMade, requestsReceived, loading } = this.props;
        const { rejectModalOpen, selectedRequest, rejectReason, successMessage, errorMessage } = this.state;

        return (
            <>
                <TopNavigation />
                <Container className={classes.requestsContainer}>
                    {/* Reject Reason Modal */}
                    <Modal isOpen={rejectModalOpen} toggle={this.closeRejectModal}>
                        <ModalHeader toggle={this.closeRejectModal}>
                            Reject Request
                        </ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to reject the request for <strong>{selectedRequest?.patientName}</strong>?</p>
                            <Input
                                type="textarea"
                                placeholder="Please provide a reason for rejecting this request..."
                                value={rejectReason}
                                onChange={(e) => this.setState({ rejectReason: e.target.value })}
                                rows="4"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.closeRejectModal}>
                                Cancel
                            </Button>
                            <Button color="danger" onClick={this.handleReject}>
                                Reject Request
                            </Button>
                        </ModalFooter>
                    </Modal>

                    <h2 className="text-center mb-4">Organ Requests Management</h2>
                    
                    {successMessage && (
                        <Alert color="success" toggle={() => this.setState({ successMessage: '' })}>
                            {successMessage}
                        </Alert>
                    )}
                    
                    {errorMessage && (
                        <Alert color="danger" toggle={() => this.setState({ errorMessage: '' })}>
                            {errorMessage}
                        </Alert>
                    )}
                    
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={this.state.activeTab === '1' ? 'active' : ''}
                                onClick={() => this.toggleTab('1')}
                                style={{ cursor: 'pointer' }}
                            >
                                Your Requests
                                {requestsMade && <Badge color="primary" className="ml-2">{requestsMade.length}</Badge>}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={this.state.activeTab === '2' ? 'active' : ''}
                                onClick={() => this.toggleTab('2')}
                                style={{ cursor: 'pointer' }}
                            >
                                Requests for Your Organs
                                {requestsReceived && <Badge color="success" className="ml-2">{requestsReceived.length}</Badge>}
                            </NavLink>
                        </NavItem>
                    </Nav>

                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <Card className={classes.requestCard}>
                                <CardBody>
                                    <CardTitle tag="h4">Requests Made by Your Hospital</CardTitle>
                                    {loading && <div className="text-center">Loading requests...</div>}
                                    {requestsMade && requestsMade.length > 0 ? (
                                        <div className={classes.tableWrapper}>
                                            <Table striped responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Recipient Name</th>
                                                        <th>Blood Group</th>
                                                        <th>Organ Type</th>
                                                        <th>Age</th>
                                                        <th>Gender</th>
                                                        <th>Phone</th>
                                                        <th>Reason</th>
                                                        <th>Location</th>
                                                        <th>Status</th>
                                                        <th>Date</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {requestsMade.map((request, index) => (
                                                        <tr key={index}>
                                                            <td>{request.firstName} {request.lastName}</td>
                                                            <td><Badge color="danger">{request.bloodGroup}</Badge></td>
                                                            <td><Badge color="info">{request.organType || 'Blood'}</Badge></td>
                                                            <td>{request.age}</td>
                                                            <td>{request.gender}</td>
                                                            <td>{request.phoneNumber}</td>
                                                            <td>{request.reason}</td>
                                                            <td>{request.address?.city}, {request.address?.state}</td>
                                                            <td>
                                                                <Badge color={request.status === 'APPROVED' ? 'success' : request.status === 'REJECTED' ? 'danger' : 'warning'}>
                                                                    {request.status}
                                                                </Badge>
                                                            </td>
                                                            <td>{new Date(request.createdOn).toLocaleDateString()}</td>
                                                            <td>
                                                                {/* Actions column for requests made - could show cancellation option in future */}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    ) : (
                                        !loading && <div className="text-center text-muted mt-3">No requests made yet</div>
                                    )}
                                </CardBody>
                            </Card>
                        </TabPane>

                        <TabPane tabId="2">
                            <Card className={classes.requestCard}>
                                <CardBody>
                                    <CardTitle tag="h4">Requests Received for Your Organs</CardTitle>
                                    {loading && <div className="text-center">Loading requests...</div>}
                                    {requestsReceived && requestsReceived.length > 0 ? (
                                        <div className={classes.tableWrapper}>
                                            <Table striped responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Recipient Name</th>
                                                        <th>Blood Group</th>
                                                        <th>Organ Type</th>
                                                        <th>Age</th>
                                                        <th>Gender</th>
                                                        <th>Phone</th>
                                                        <th>Reason</th>
                                                        <th>Location</th>
                                                        <th>Status</th>
                                                        <th>Date</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {requestsReceived.map((request, index) => (
                                                        <tr key={index}>
                                                            <td>{request.firstName} {request.lastName}</td>
                                                            <td><Badge color="danger">{request.bloodGroup}</Badge></td>
                                                            <td><Badge color="info">{request.organType || 'Blood'}</Badge></td>
                                                            <td>{request.age}</td>
                                                            <td>{request.gender}</td>
                                                            <td>{request.phoneNumber}</td>
                                                            <td>{request.reason}</td>
                                                            <td>{request.address?.city}, {request.address?.state}</td>
                                                            <td>
                                                                <Badge color={request.status === 'APPROVED' ? 'success' : request.status === 'REJECTED' ? 'danger' : 'warning'}>
                                                                    {request.status}
                                                                </Badge>
                                                            </td>
                                                            <td>{new Date(request.createdOn).toLocaleDateString()}</td>
                                                            <td>
                                                                {request.status === 'PENDING' && (
                                                                    <>
                                                                        <Button 
                                                                            color="success" 
                                                                            size="sm" 
                                                                            className="mr-2"
                                                                            onClick={() => this.handleApprove(request)}
                                                                        >
                                                                            Approve
                                                                        </Button>
                                                                        <Button 
                                                                            color="danger" 
                                                                            size="sm"
                                                                            onClick={() => this.openRejectModal(request)}
                                                                        >
                                                                            Reject
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    ) : (
                                        !loading && <div className="text-center text-muted mt-3">No requests received for your organs yet</div>
                                    )}
                                </CardBody>
                            </Card>
                        </TabPane>
                    </TabContent>
                </Container>
                <Footer />
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    requestsMade: state.hospital.requestsMade,
    requestsReceived: state.hospital.requestsReceived,
    loading: state.hospital.loading
});

const mapDispatchToProps = (dispatch) => ({
    fetchRequestsMade: (hospitalId) => dispatch(fetchHospitalRequestsMade(hospitalId)),
    fetchRequestsReceived: (hospitalId) => dispatch(fetchHospitalRequestsReceived(hospitalId))
});

export default connect(mapStateToProps, mapDispatchToProps)(HospitalRequests);

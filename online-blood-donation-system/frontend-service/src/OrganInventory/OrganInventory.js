import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Badge, Table } from 'reactstrap';
import { fetchOrganInventory } from '../redux/actions/hospital/hospitalActions';
import TopNavigation from '../Navigation/TopNavigation/TopNavigation';
import Footer from '../Footer/Footer';
import classes from './OrganInventory.module.css';

class OrganInventory extends React.Component {
    componentDidMount() {
        this.props.fetchInventory();
    }

    render() {
        const { inventory, loading } = this.props;

        return (
            <>
                <TopNavigation />
                <Container className={classes.inventoryContainer}>
                    <h2 className="text-center mb-4">Organ Inventory</h2>
                    {loading && <div className="text-center">Loading inventory...</div>}
                    {inventory && Object.keys(inventory).length > 0 ? (
                        <Row>
                            {Object.entries(inventory).map(([organType, data]) => (
                                <Col md="12" key={organType} className="mb-4">
                                    <Card className={classes.organCard}>
                                        <CardBody>
                                            <CardTitle tag="h4">
                                                {organType.replace('_', ' ')}
                                                <Badge color="primary" className="ml-3">
                                                    Available: {data.totalCount}
                                                </Badge>
                                            </CardTitle>
                                            {data.organDetails && data.organDetails.length > 0 ? (
                                                <div className={classes.tableWrapper}>
                                                    <Table striped responsive hover>
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Donor Name</th>
                                                                <th>Age / Gender</th>
                                                                <th>Blood Group</th>
                                                                <th>Contact</th>
                                                                <th>Hospital</th>
                                                                <th>Location</th>
                                                                <th>Organ Details</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.organDetails.map((organ, index) => (
                                                                <tr key={index}>
                                                                    <td><strong>{index + 1}</strong></td>
                                                                    <td>
                                                                        <strong>{organ.donorName}</strong>
                                                                        {organ.email && (
                                                                            <><br/><small className="text-muted">{organ.email}</small></>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {organ.age} years<br/>
                                                                        <Badge color="info" className="mt-1">{organ.gender}</Badge>
                                                                    </td>
                                                                    <td>
                                                                        <Badge color="danger" style={{fontSize: '14px'}}>{organ.bloodGroup}</Badge>
                                                                    </td>
                                                                    <td>
                                                                        <strong><span role="img" aria-label="Phone">📱</span> {organ.phoneNumber}</strong>
                                                                    </td>
                                                                    <td>
                                                                        {organ.hospitalName || 'N/A'}
                                                                    </td>
                                                                    <td>
                                                                        <span role="img" aria-label="Location">📍</span> {organ.city}<br/>
                                                                        <small className="text-muted">{organ.state}, {organ.country}</small>
                                                                    </td>
                                                                    <td>
                                                                        <strong>Quantity:</strong> {organ.quantity}<br/>
                                                                        {organ.lifeSpan && (
                                                                            <><small><strong>Life Span:</strong> {organ.lifeSpan}</small><br/></>
                                                                        )}
                                                                        <Badge color="success" className="mt-1">Active</Badge>
                                                                    </td>
                                                                    <td>
                                                                        <Badge color="success" pill style={{fontSize: '12px'}}><span role="img" aria-label="Available">✓</span> Available</Badge>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <CardText className="text-muted">No organs available in this category</CardText>
                                            )}
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        !loading && <div className="text-center">No organs available in inventory</div>
                    )}
                </Container>
                <Footer />
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    inventory: state.hospital.inventory,
    loading: state.hospital.loading
});

const mapDispatchToProps = (dispatch) => ({
    fetchInventory: () => dispatch(fetchOrganInventory())
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganInventory);

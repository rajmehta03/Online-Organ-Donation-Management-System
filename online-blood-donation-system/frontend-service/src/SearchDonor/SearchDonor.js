import React from 'react';
import {
    Container,
    Row,
    Col
} from 'reactstrap'
import TopNavigation from '../Navigation/TopNavigation/TopNavigation';
import Footer from '../Footer/Footer';
import classes from './SearchDonor.module.css';
import BreadcrumbC from '../BreadcrumbC/BreadcrumbC';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Table,
    Alert
} from 'reactstrap';
import MediaC from '../MediaC/MediaC';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bloodDonorSearch } from '../redux/actions/donor/searchDonor';

class SearchDonor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bloodGroup: '',
            pincode: '',
            organType: '',
            selectedCategory: '', // New state for category selection
            bloodDonor: [],
            allDonors: [] // Store all donors for smart sorting
        }
    }

    changeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);
        
        // Use organType if provided, otherwise use bloodGroup
        const searchParam = this.state.organType || this.state.bloodGroup;
        
        // Make pincode and blood group optional
        // If no search criteria provided, fetch all active organ donors
        if (!searchParam && !this.state.pincode) {
            // Fetch all active organ donors
            this.props.bloodDonorSearch('', '', 'all');
        } else {
            this.props.bloodDonorSearch(this.state.pincode, searchParam, this.state.organType ? 'organ' : 'blood');
        }
        
        setTimeout(() => {
            this.setState({
                ...this.state,
                bloodDonor: this.props.bloodDonor,
                allDonors: this.props.bloodDonor
            })
        }, 1000);
    }

    reset = () => {
        this.setState({
            bloodGroup: '',
            pincode: '',
            organType: '',
            selectedCategory: '', // Reset category selection
            bloodDonor: [],
            allDonors: []
        })
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    // Function to filter donors by selected category
    filterDonorsByCategory = (donors, category) => {
        if (!category) return donors;
        return donors.filter(donor => donor.organType === category);
    }

    // Handle category selection change
    handleCategoryChange = (event) => {
        this.setState({
            selectedCategory: event.target.value
        });
    }

    // Smart sorting function based on matching criteria
    sortDonorsBySimilarity = (donors, pincode, bloodGroup, organType) => {
        if (!donors || donors.length === 0) return donors;
        
        return donors.sort((a, b) => {
            const aScore = this.calculateMatchScore(a, pincode, bloodGroup, organType);
            const bScore = this.calculateMatchScore(b, pincode, bloodGroup, organType);
            return bScore - aScore; // Higher score first
        });
    }

    // Calculate match score based on criteria
    calculateMatchScore = (donor, pincode, bloodGroup, organType) => {
        let score = 0;
        
        // Check pincode match (highest priority)
        if (pincode && donor.address && donor.address.zip === pincode) {
            score += 3;
        }
        
        // Check blood group match (medium priority)
        if (bloodGroup && donor.bloodGroup === bloodGroup) {
            score += 2;
        }
        
        // Check organ type match (medium priority)
        if (organType && donor.organType === organType) {
            score += 2;
        }
        
        // Bonus for having organ data
        if (donor.organType) {
            score += 1;
        }
        
        return score;
    }

    render() {
        console.log(this.props.match.path);
        const { pincode, bloodGroup, organType, selectedCategory } = this.state;
        
        // Sort donors by similarity score
        const sortedDonors = this.sortDonorsBySimilarity(
            this.state.bloodDonor, 
            this.state.pincode, 
            this.state.bloodGroup, 
            this.state.organType
        );
        
        // Filter donors based on selected category
        const filteredDonors = this.filterDonorsByCategory(sortedDonors, selectedCategory);
        
        // Get unique organ types from donors for the category dropdown
        const organTypes = [...new Set(this.state.bloodDonor
            .filter(donor => donor.organType)
            .map(donor => donor.organType))]
            .sort();
            
        return (
            <Container>
                <Row>
                    <Col>
                        <TopNavigation />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2 className={classes.pageHeading}>
                            <FontAwesomeIcon icon="search" /> Search Organ Donor Availability
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
                    <Col>
                        <Row>
                            <Col>
                                <h3 className={classes.formHeading}>
                                    <FontAwesomeIcon icon="search" /> Search Organ Donor by Location
                                </h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <Form className={classes.form} onSubmit={this.handleSubmit}>
                                        <FormGroup>
                                            <Label for="pincode" className={classes.Label}>Pincode (Optional)</Label>
                                            <Input type="text"
                                                id="pincode"
                                                name="pincode"
                                                placeholder="Enter pincode"
                                                value={pincode}
                                                onChange={this.changeHandler} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="bloodGroup" className={classes.Label}>Blood Group (Optional)</Label>
                                            <Input type="select"
                                                name="bloodGroup"
                                                id="bloodGroup"
                                                value={bloodGroup}
                                                onChange={this.changeHandler}>
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
                                        <FormGroup>
                                            <Label for="organType" className={classes.Label}>Organ Type (Optional)</Label>
                                            <Input type="select"
                                                name="organType"
                                                id="organType"
                                                value={organType}
                                                onChange={this.changeHandler}>
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
                                            <small className="text-muted">Search by any combination of criteria</small>
                                        </FormGroup>
                                        <FormGroup>
                                            <Input type="submit"
                                                value="Search Donor"
                                                className="btn-lg btn-danger" />
                                        </FormGroup>
                                        <FormGroup>
                                            <button type="button"
                                                onClick={this.reset}
                                                className="btn btn-secondary btn-block">Reset Search</button>
                                        </FormGroup>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        {/* Category filter dropdown - only show when donors are found */}
                        {this.state.bloodDonor.length > 0 && (
                            <Row className="mb-3">
                                <Col>
                                    <Label for="categoryFilter" className={classes.Label}>Filter by Organ Category</Label>
                                    <Input type="select"
                                        name="categoryFilter"
                                        id="categoryFilter"
                                        value={selectedCategory}
                                        onChange={this.handleCategoryChange}>
                                        <option value="">All Categories</option>
                                        {organTypes.map((type, index) => (
                                            <option key={index} value={type}>{type.replace('_', ' ')}</option>
                                        ))}
                                    </Input>
                                </Col>
                            </Row>
                        )}
                        
                        <div className={classes.rightColumn}>
                            {
                                filteredDonors.length === 0 && this.state.bloodDonor.length > 0 ? 
                                <Alert style={{marginTop:'150px'}} color="info">
                                    <h4>No donors found!</h4>
                                    <p>No donors available in the specified category.</p>
                                </Alert> : 
                                this.state.bloodDonor.length === 0 ? 
                                <Alert style={{marginTop:'150px'}} color="info">
                                    <h4>No donors found!</h4>
                                    <p>No organ or blood donors available matching your criteria.</p>
                                </Alert> : ''
                            }
                            {
                                filteredDonors.map((donor, index) =>
                                    <MediaC key={index} image={`data:image/jpeg;base64,${donor.image}`}
                                        imageAlt=""
                                        heading={`${donor.firstName} ${donor.middleName} ${donor.lastName}`}
                                        mediaObjectClassName={classes.MediaObject}
                                        body={
                                            <Table bordered>
                                                <tbody>
                                                    <tr>
                                                        <th>State</th>
                                                        <td>{donor.address.state}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>City</th>
                                                        <td>{donor.address.city}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Area</th>
                                                        <td>{donor.address.area}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Pincode</th>
                                                        <td>{donor.address.zip}</td>
                                                    </tr>
                                                    {donor.organType && (
                                                        <>
                                                            <tr>
                                                                <th>Organ Type</th>
                                                                <td><strong style={{color: '#28a745'}}>{donor.organType}</strong></td>
                                                            </tr>
                                                            <tr>
                                                                <th>Organ Quantity</th>
                                                                <td><strong>{donor.organQuantity || 0}</strong></td>
                                                            </tr>
                                                            <tr>
                                                                <th>Organ Status</th>
                                                                <td>{donor.organActive ? <span style={{color: 'green'}}>✓ Available</span> : <span style={{color: 'red'}}>Not Available</span>}</td>
                                                            </tr>
                                                            {donor.organLifeSpan && (
                                                                <tr>
                                                                    <th>Life Span</th>
                                                                    <td>{donor.organLifeSpan}</td>
                                                                </tr>
                                                            )}
                                                        </>
                                                    )}
                                                    <tr>
                                                        <th>Blood Group</th>
                                                        <td>{donor.bloodGroup}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        } />)
                            }
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
}

const mapStateToProps = (state) => {
    return {
        bloodDonor: state.searchDonor.bloodDonor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        bloodDonorSearch: (pincode, bloodGroup, searchType) => dispatch(bloodDonorSearch(pincode, bloodGroup, searchType))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchDonor);
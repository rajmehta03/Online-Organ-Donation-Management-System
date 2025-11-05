import axios from 'axios';

export const register = (image, request) => {
    console.log("Sending registration data:", request);
    const jsonString = JSON.stringify(request);
    console.log("JSON string:", jsonString);
    
    let formdata = new FormData();
    formdata.append("file", image);
    formdata.append("request", jsonString);

    return axios.post("http://localhost:8080/api/v1/donor", formdata, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const search = (pincode, searchParam, searchType) => {
    const params = {};
    
    // Add pincode if provided
    if (pincode) {
        params.zip = pincode;
    }
    
    // Determine search type
    if (searchType === 'all') {
        // Fetch all organ donors
        params.allOrgans = true;
    } else if (searchType === 'organ' && searchParam) {
        params.organType = encodeURIComponent(searchParam);
    } else if (searchParam) {
        params.bloodGroup = encodeURIComponent(searchParam);
    }
    
    return axios.get("http://localhost:8080/api/v1/donors", { params });
}

export const findAll = (status) => {
    return axios.get("http://localhost:8080/api/v1/donors", {
        params: {
            "status": status
        }
    })
}

export const deleteDonor = (id) => {
    return axios.delete(`http://localhost:8080/api/v1/donor/${id}`)
}

export const getDonor = (id)=>{
    return axios.get(`http://localhost:8080/api/v1/donor/${id}`)
}

export const updateDonor = (id,status)=>{
    return axios.patch(`http://localhost:8080/api/v1/donor/${id}`, {
        "status":status
    })
}

export const getMatchingRequests = (donorId) => {
    return axios.get(`http://localhost:8080/api/v1/donor/${donorId}/requests`);
}

export const approveRequest = (requestId, donorId) => {
    return axios.post(`http://localhost:8080/api/v1/recipient/${requestId}/approve/${donorId}`);
}
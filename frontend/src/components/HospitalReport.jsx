import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import  {jsPDF} from "jspdf"
import autoTable from 'jspdf-autotable'; 

function HospitalReport() {

    // Display current date 
            const currentDate = new Date().toLocaleDateString();
        
            const [hospitalrReports, sethospitalrReport] = useState(null)
            const {user} = useAuthContext()

            useEffect(()=>{
                const fetchHospitalReport = async()=>{
                    try{
                        const response = await fetch('/api/hospital/hospitalRepoet/', {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${user.token}`, 
                                "Content-Type": "application/json"
                            },   
                        }); 

                        const json = await response.json();

                        if (!response.ok) {
                            console.log("Error:", json) 
                            return
                        }
                        sethospitalrReport(json);
                    }
                    catch(error){
                        console.error("Error fetching Report details:", error);
                    }
                }
                fetchHospitalReport()
            },[user])

            //Delte
            const handleDelte= async(reportId)=>{
                if (!user) return;
                try{
                    const response = await fetch(`/api/hospital/hospitalRepoet/${reportId}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (!response.ok) {
                        console.log("Error deleting report:", await response.json());
                        console.log("Error deleting report:", errorData);
                        return;
                    }
            
                    sethospitalrReport(hospitalrReports.filter(report => report._id !== reportId));
            
                    console.log("Report deleted successfully");
                }catch (error) {
                    console.error("Error deleting Report:", error);
                }
            };

            //Genarate PDF
            const generateSinglePdf = (report) => {
                console.log("Generating PDF for:", report); 
                const doc = new jsPDF("portrait");
                doc.text("Hospital Report", 14, 10);
              
                const tableData = [
                  ['First Name', report.fname],
                  ['Last Name', report.lname],
                  ['Guardian', report.guardian],
                  ['Ambulance ID', report.AmbulanceID],
                  ['Doctor Name', report.DoctorName],
                  ['Disease', report.Disease],
                  ['First Aid', report.FirstAid],
                  ['Symptoms', report.Symptoms]
                ];
                
                autoTable(doc,{
                    startY: 20,
                    body: tableData,
                    theme: 'grid',
                    styles: { halign: 'left' }
                  });
              
                doc.save(`${report.fname}_${report.lname}_Report.pdf`);
              };
              
  return (
    <div>
        <div className='flex flex-row '>
                        <div className='h-screen bg-[#EC221F] p-10 w-80 flex flex-col space-y-8 '>
                            <h1 className='text-white text-2xl ' >{user.firstName} {user.lastName}</h1>
                            <Link to ="/hospital/HospitalStaffDashBoard"> <h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Doctor Details</h3></Link>
                            <Link to ="/hospital/AmbulanceArrivalTime"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Ambulance Arrival Time</h3></Link>
                            <Link to ="/hospital/HospitalDetail"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Hospital detials</h3></Link>
                            <Link to ="/hospital/Report"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Report</h3></Link>
                            <Link to ="/hospital/ChatWindow"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Chat Window</h3></Link>
                        </div>
        
                        <div>
                            <div className='flex flex-row flex space-x-100'>
                                <h1 className='ml-7 mt-5 text-2xl '>Report</h1>
                                <div>
                                    <h1 className='ml-7 mt-5 text-2xl'>{currentDate}</h1>
                                    <Link to ="/hospital/hospitalRepoet"> <h1 className='text-white bg-[#EC221F] w-70 p-5 rounded mt-3 ml-20'>+ Add Report Details</h1></Link>
                                </div>
                            </div>
        
                            <div className='bg-[#D9D9D9] w-200 ml-10 mt-10 p-5 space-y-6'>
                                {hospitalrReports && hospitalrReports.map((hospitalrReport) => (
                                    <div
                                    key={hospitalrReport._id}
                                    className='bg-white p-4 rounded mt-5 shadow-md border border-gray-300'
                                    >
                                    <p><strong>ID:</strong> {hospitalrReport._id}</p>
                                    <p><strong>Name:</strong> {hospitalrReport.fname} {hospitalrReport.lname}</p>
                                    <p><strong>Guardian:</strong> {hospitalrReport.guardian}</p>
                                    <p><strong>Doctor:</strong> {hospitalrReport.DoctorName}</p>
                                    <p><strong>Ambulance ID:</strong> {hospitalrReport.AmbulanceID}</p>
                                    <p><strong>First Aid:</strong> {hospitalrReport.FirstAid}</p>
                                    <p><strong>Disease:</strong> {hospitalrReport.Disease}</p>
                                    <p><strong>Symptoms:</strong> {hospitalrReport.Symptoms}</p>
                                    <div class="flex space-x-4">
                                        <button className='bg-[#EC221F] w-40 h-10 rounded mt-5 text-white hover:bg-red-700' onClick={() => generateSinglePdf(hospitalrReport)}>Download</button>
                                        <button className='bg-[#EC221F] w-40 h-10 rounded mt-5 text-white hover:bg-red-700' onClick={() => handleDelte(hospitalrReport._id)}>Delete</button>
                                    </div>
                                    
                                    </div>
                                ))}
                            </div>

                        </div>
                        
                        
                </div>
      
    </div>
  )
}

export default HospitalReport

import React, { Component } from 'react';
import { CSVLink } from "react-csv";
import '../../components/layout/Button/styles/btn-styles.scss';
import ModalBoard from '../../components/boards/modal-board/ModalBoard';
import CITY_OPTIONS from '../../constants/CityOptions.js'
import './CSVGenerator.scss';
class CSVGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisibleModal: false,
        };

        this.generateCSV = this.generateCSV.bind(this);
        this.getCSVData = this.getCSVData.bind(this);
        this.sortRows = this.sortRows.bind(this);
        this.trimDate = this.trimDate.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.sortUserTrips = this.sortUserTrips.bind(this);
    }
  
    componentDidUpdate(previousProps) {      
        if (previousProps.open!== this.props.open) {
            this.setState({ isVisibleModal: true })
        
        }
    }

    handleClose() {
        this.setState({
            isVisibleModal: !this.state.isVisibleModal,
        });
    }
    
    trimDate(date)
    {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = date.getFullYear();
        return yyyy+'-'+ mm + '-' + dd ;
    }

    sortRows(selectedRows){
        let currName = "";
        let csvCount = 0;
        
        if(selectedRows.length > 0){
         
            selectedRows.sort((a, b) => {
                if(a.driver > b.driver) { 
                    return 1;
                } 
                else if(a.driver === b.driver) {
                     if(a.size > b.size) {
                         return 1;
                    } else {
                        return -1;
                    }} else {
                    return -1; 
                }});
        
             let sortedRows = [];
             selectedRows.forEach((item) => {
                    if(currName !== item.driver){
                        csvCount++;
                        currName = item.driver;
                        sortedRows.push([]);
                    }
                    sortedRows[csvCount-1].push(item);
             })

             return sortedRows;
        }
    }

    sortUserTrips(trips)
    {
        trips.sort((a, b) => {
            if(a.leavingDate > b.leavingDate) { 
                return 1;
            } 
            else if(a.leavingDate === b.leavingDate) {
                 if(a.size > b.size) {
                     return 1;
                } else {
                    return -1;
                }} else {
                return -1; 
            }});

         return trips;
    }

    getCSVData(trips){

        trips = this.sortUserTrips(trips);

        let finalData = [
            ["Kuro ataskaita"],
            ["Kelionės ataskaita užpildyta:",trips[0].driver+','+this.trimDate(new Date())],
            ["Išvykimo laikas","Grįžimo laikas","Išvykimo vieta","Paskyrimo vieta","Važiavimo tikslas","Nuvažiuota (km)","Kelionės kaina (Eur)"],
        ]
        const defaultKm = 103;
        const defaultPrice = 30.9;

        let totalKm =0;
        let totalPrice =0;

        trips.forEach((trip) => {
            const leavingDate = this.trimDate(new Date(Date.parse(trip.leavingDate)));
            const returnDate = trip.returnDate === null? "":this.trimDate(new Date(Date.parse(trip.returnDate)));
            finalData.push([
                leavingDate,
                returnDate,
                trip.origin,
                trip.destination,
                trip.destination === CITY_OPTIONS[1]? "Kauno ofisas":"Vilniaus ofisas",
                defaultKm,
                defaultPrice
            ])
            totalKm += defaultKm;
            totalPrice += defaultPrice;
        })

        finalData.push(["","","","","Iš viso: ",totalKm+" km",totalPrice.toFixed(2) +"Eur"]);
        return finalData;
          
    }

    generateCSV() {
        if(this.props.selectedRows.length > 0 ){
            let sortedRows = this.sortRows( this.props.selectedRows);

            if(sortedRows.length > 0){
                const body = sortedRows.map((item,i) => {
                        return(
                            <div className ="csv-modal__block" key={i}>
                                <div className ="csv-modal__element__name">
                                    {item[0].driver}:
                                </div>
                                <div className ="csv-modal__element">
                                    <CSVLink 
                                        data={this.getCSVData(item)}
                                        className="btn-bordered"
                                        filename={item[0].driver+" Travel report "+this.trimDate(new Date())+".csv"}
                                    >
                                        Download
                                    </CSVLink>
                                </div>
                                
                            </div>
                        );
                    })
                return body;
            }
        }
        
        return(
            <div>No trips selected</div>
        )
    }

    render() {
        const modal = (
            <div className="scrollBox">
                 {this.generateCSV()}
            </div>
        );

        return (
            <ModalBoard
                isVisible={this.state.isVisibleModal}
                headerTitle={"Download CSV's"}
                innerSection={modal}
                cancelOnClick={this.handleClose}
                disableActionButton={true}
            />
        );
    }
}

export default CSVGenerator;


// Import the functions you need from the SDKs you need
import { response } from 'express';
import { QuerySnapshot } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc,
    setDoc, writeBatch
} from 'firebase/firestore';
import { Vehicle, Response, updateVehicle } from './libraryType/type';
import { app, db } from './account'
import { DriverRegister } from './driver';


// Initialize Firebase
const VehicleRef = collection(db, 'Vehicle');
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');

export class vehicle { // complete this class and delete this comment
    type: string
    licenseplate: string
    enginefuel: string
    height: string
    length: string
    width: string
    mass: string
    status: string
    price: number
    velocity: number
    maintenanceDay?: Date
    constructor(vehicleInfo: Vehicle) {
        this.type = "vehicle"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel ? vehicleInfo.enginefuel : "vehicleInfo.enginefuel"
        this.height = vehicleInfo.height ? vehicleInfo.height : "vehicleInfo.height",
            this.width = vehicleInfo.width ? vehicleInfo.width : "vehicleInfo.width",
            this.length = vehicleInfo.length ? vehicleInfo.length : " vehicleInfo.length",
            this.mass = vehicleInfo.mass ? vehicleInfo.mass : " vehicleInfo.mass",
            this.status = vehicleInfo.status ? vehicleInfo.status : "vehicleInfo.status",
            this.price = vehicleInfo.price ? vehicleInfo.price : 0,
            this.velocity = vehicleInfo.velocity ? vehicleInfo.velocity : 0,
            vehicleInfo.maintenanceDay ? this.maintenanceDay = vehicleInfo.maintenanceDay : null
    }
    async storeToFB() {
        try {
            await addDoc(VehicleRef, {
                type: this.type,
                licenseplate: this.licenseplate,
                enginefuel: this.enginefuel,
                height: this.height,
                length: this.length,
                width: this.width,
                mass: this.mass,
                status: this.status,
                price: this.price,
                velocity: this.velocity,
                maintenanceDay: this.maintenanceDay ? this.maintenanceDay : "null"
            })
        }
        catch (error) {
            console.log(error)
            throw error
        }
    }
    static async deleteVehicle(id: string) {
        const docRef = doc(db, 'Vehicle', id)
        const data = await getDoc(docRef)
        if (!data.exists) throw "id not exist when call delete vehicle by ID"
        const result = { ...data.data(), id: data.id }
        if (data.exists() && data.data().status == "Active") {
            console.log(`Vehicle id ${data.id} is Active, please wait for route end or delete route to delete this vehicle`)
            return result
        }
        await deleteDoc(docRef)
        return result
    }
    static async updateVehicle(id: string, updateField: updateVehicle) {
        const docRef = doc(db, 'Vehicle', id)
        const data = await getDoc(docRef)
        if (!data.exists) throw "ID not exist when call update vehicle by ID"
        const updateData = { ...data.data() };
        for (const [fieldName, fieldValue] of Object.entries(updateField)) {
            updateData[fieldName] = fieldValue; // Update only provided fields
        }
        await updateDoc(docRef,
            updateData
        )
        return updateData
    }
    static async ScanForMaintenance() {

        const vehicleArray = await (getDocs(VehicleRef))
        vehicleArray.docs.forEach(async (doc) => {
            if (doc.data().maintenanceDay) {
                let realStatus = doc.data().status;
                const checkmaintenanceDay = new Date()
                // console.log(doc.data().maintenanceDay.toDate().getDate())
                // console.log(checkmaintenanceDay.getDate())
                // console.log(realStatus)
                // console.log(checkmaintenanceDay.getDate() == doc.data().maintenanceDay.toDate().getDate())
                if (checkmaintenanceDay.getDate() == doc.data().maintenanceDay.toDate().getDate() && realStatus == "Inactive") {
                    await this.updateVehicle(doc.id, { status: "Maintenance" })
                    // console.log(1)
                }
                else if (realStatus == "Maintenance" && checkmaintenanceDay > doc.data().maintenanceDay.toDate()) {
                    // console.log(2)
                    await this.updateVehicle(doc.id, { status: "Inactive" })
                }
                // else console.log(3)

            }
        })
    }
}
class Truck extends vehicle {                                                                  //inheritance
    constructor(vehicleInfo: Vehicle) {
        super(vehicleInfo)
        this.type = "Truck"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel ? vehicleInfo.enginefuel : "Gasoline"
        this.height = vehicleInfo.height ? vehicleInfo.height : "1,5"
        this.length = vehicleInfo.length ? vehicleInfo.length : "4,6"
        this.mass = vehicleInfo.mass ? vehicleInfo.mass : "500 "
        this.status = vehicleInfo.status ? vehicleInfo.status : "Active"
        this.price = vehicleInfo.price ? vehicleInfo.price : 2500
        this.velocity = vehicleInfo.velocity ? vehicleInfo.velocity : 60
        vehicleInfo.maintenanceDay ? this.maintenanceDay = vehicleInfo.maintenanceDay : null
    }
}
class Bus extends vehicle {
    constructor(vehicleInfo: Vehicle) {
        super(vehicleInfo)
        this.type = "Bus"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel ? vehicleInfo.enginefuel : "Diesel"
        this.height = vehicleInfo.height ? vehicleInfo.height : "3.81 "
        this.length = vehicleInfo.length ? vehicleInfo.length : "12 "
        this.width = vehicleInfo.width ? vehicleInfo.width : "3"
        this.mass = vehicleInfo.mass ? vehicleInfo.mass : "700 "
        this.status = vehicleInfo.status ? vehicleInfo.status : "Active"
        this.price = vehicleInfo.price ? vehicleInfo.price : 4500
        this.velocity = vehicleInfo.velocity ? vehicleInfo.velocity : 47
        vehicleInfo.maintenanceDay ? this.maintenanceDay = vehicleInfo.maintenanceDay : null
    }
}
class ContainerTruck extends vehicle {
    constructor(vehicleInfo: Vehicle) {
        super(vehicleInfo)
        this.type = "ContainerTruck"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel ? vehicleInfo.enginefuel : "Gasoline"
        this.height = vehicleInfo.height ? vehicleInfo.height : "1,9 "
        this.width = vehicleInfo.width ? vehicleInfo.width : "3"
        this.length = vehicleInfo.length ? vehicleInfo.length : "3,1 "
        this.mass = vehicleInfo.mass ? vehicleInfo.mass : "500 "
        this.status = vehicleInfo.status ? vehicleInfo.status : "Active"
        this.price = vehicleInfo.price ? vehicleInfo.price : 3000
        this.velocity = vehicleInfo.velocity ? vehicleInfo.velocity : 60
        vehicleInfo.maintenanceDay ? this.maintenanceDay = vehicleInfo.maintenanceDay : null
    }
}



export class VehicleOperation {
    constructor() { }
    async createVehicle(vehicleInfo: Vehicle) {
        let response: Response = {
            error: true,
            data: null
        }

        var veh: vehicle

        switch (vehicleInfo.type.toUpperCase()) {                    //factory design pattern
            case "BUS":
                veh = new Bus(vehicleInfo)
                break;
            case "CONTAINERTRUCK":
                veh = new ContainerTruck(vehicleInfo)
                break;
            case "TRUCK":
                veh = new Truck(vehicleInfo)
                break;
            default:
                throw "wrong type when calling vehicle"

        }

        try {
            if (veh) {
                response.data = veh
                response.error = false
                await veh.storeToFB()
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            return response
        }
    }
    async viewAllVehicle() {
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        try {
            await DriverRegister.ScanForRouteEnd()
            await vehicle.ScanForMaintenance()
            const vehicleArray = await (getDocs(VehicleRef))
            vehicleArray.docs.forEach(async (doc) => {
                result.push({
                    type: doc.data().type,
                    licenseplate: doc.data().licenseplate,
                    enginefuel: doc.data().enginefuel,
                    height: doc.data().height,
                    length: doc.data().length,
                    width: doc.data().width,
                    mass: doc.data().mass,
                    price: doc.data().price,
                    velocity: doc.data().velocity,
                    id: doc.id,
                    maintenanceDay: new Date(doc.data().maintenanceDay.seconds * 1000),
                    status: doc.data().status,
                })
            })
            if (result) {
                response.data = result
                response.error = false
            }

        }
        catch (error) {
            console.log(error)
        }
        finally {
            return response
        }
    }
    async viewAvailableVehicle() {
        let response: Response = {
            error: true,
            data: null
        }

        let result: any[] = []
        // await DriverRegister.ScanForRouteEnd()
        await vehicle.ScanForMaintenance()
        const q = query(VehicleRef, where("status", "==", "Inactive"))
        try {

            const vehicleArray = await (getDocs(q))

            vehicleArray.docs.forEach(async (doc) => {
                result.push({ ...doc.data(), id: doc.id })
            })
            if (result) {
                response.data = result
                response.error = false
            }

        }
        catch (error) {
            return response
        }
        finally {
            return response
        }
    }
    async deleteAllVehicle() {
        let response: Response = {
            error: true,
            data: null
        }

        try {
            const batch = writeBatch(db);
            const querySnapshot = await getDocs(query(VehicleRef));

            querySnapshot.forEach((doc) => {
                if (doc.data().status != 1)
                    deleteDoc(doc.ref);
                else
                    console.log(`Vehicle id ${doc.id} is Active, please wait for route end or delete route to delete this vehicle`)
            });
            response.error = false
        }
        catch (error) {
            console.log(error)
        }
        finally {
            return response
        }

    }
    async deleteVehicleByID(vehicleID: string) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            response.data = await vehicle.deleteVehicle(vehicleID)
            response.error = false
        } catch (error) {
            console.log(error)
        } finally {

            return response;
        }
    }
    async updateVehicleByID(vehicleID: string, updateField: updateVehicle) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            response.data = await vehicle.updateVehicle(vehicleID, updateField)
            response.data.id = vehicleID
            response.error = false
        } catch (error) {
            console.log(error)
        } finally {
            return response;
        }
    }
    async GetVehicle(vehicleId: string) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            await DriverRegister.ScanForRouteEnd()
            const vehicleDoc = await getDoc(doc(db, "Vehicle", vehicleId));

            if (vehicleDoc.exists()) {
                const vehicleData = vehicleDoc.data();
                response.data = {
                    type: vehicleData.type,
                    licenseplate: vehicleData.licenseplate,
                    enginefuel: vehicleData.enginefuel,
                    height: vehicleData.height,
                    length: vehicleData.length,
                    width: vehicleData.width,
                    mass: vehicleData.mass,
                    status: vehicleData.status,
                    price: vehicleData.price,
                    velocity: vehicleData.price,
                    maintenanceDay: new Date(vehicleData.maintenanceDay.seconds * 1000),
                    id: vehicleId
                };
                response.error = false
            }
            else {
                // If ID does not exist
                throw "Driver not found"

            }
        }
        catch (error) {
            console.error("Error retrieving driver:", error);

        }
        finally {
            return response
        }
    }
};
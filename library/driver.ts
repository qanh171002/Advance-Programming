// Import the functions you need from the SDKs you need

import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc, writeBatch,
    arrayUnion,
    setDoc
} from 'firebase/firestore';

import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { Driver, Response, Address, Route, updateDriver } from './libraryType/type';
import { app, storage } from './account'
import { RouteOperation, trip } from './route';
import { vehicle } from './vehicle'


// Initialize Firebase

const db = getFirestore();
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');

export class DriverRegister {

    id?: string
    // type: string
    //change here when we have updateIMG func
    driveHistory?: string[]               // we can cal experience by check the length of this , this is arr of route id
    driverName: string
    driverNumber: string
    driverAddress: Address
    driverStatus: number
    driverLicense: Blob[]

    constructor(driverInfo: Driver) {

        this.driverNumber = driverInfo.driverNumber
        this.driverName = driverInfo.driverName
        this.driverAddress = driverInfo.driverAddress
        this.driverStatus = driverInfo.driverStatus ? driverInfo.driverStatus : 0
        this.driverLicense = driverInfo.driverLicense

    }
    async storeToFB() {
        try {
            const docRef = await addDoc(DriverRef, {
                driverName: this.driverName,
                driverNumber: this.driverNumber,
                driverAddress: JSON.stringify(this.driverAddress),
                driverStatus: this.driverStatus
            });

            const downloadURLs = await Promise.all(
                this.driverLicense.map(async (image: Blob) => {
                    const fileName = `Driver_license_${Date.now()}`;
                    const imageRef = ref(storage, `Driver/${docRef.id}/${fileName}`);
                    //@ts-ignore
                    await uploadBytes(imageRef, image, "data_url");
                    return getDownloadURL(imageRef);
                })
            );

            await updateDoc(doc(db, "Driver", docRef.id), {
                driverLicense: arrayUnion(...downloadURLs)
            });
        } catch (error) {
            throw error;
        }
    }
    static async deleteDriver(id: string) {
        const docRef = doc(db, 'Driver', id)
        const data = await getDoc(docRef)
        if (!data.exists()) throw "id not exist when call delete driver by ID"
        const result = { ...data.data(), id: data.id }
        if (data.exists() && data.data().driverStatus == 1) {
            console.log(`Driver id ${data.id} is Active, please wait for route end or delete route to delete this driver`)
            return result
        }
        await deleteDoc(docRef)
        return result
    }
    static async updateDriver(id: string, updateField: updateDriver) {
        const docRef = doc(db, 'Driver', id);
        const data = await getDoc(docRef);

        if (!data.exists) {
            throw "ID does not exist when calling update driver by ID";
        }

        const updateData = { ...data.data() };

        for (const [fieldName, fieldValue] of Object.entries(updateField)) {
            if (fieldName === 'driverLicense') {
                const downloadURLs = await Promise.all(
                    fieldValue.map(async (image: Blob) => {
                        const fileName = `Driver_license_${Date.now()}`;
                        const imageRef = ref(storage, `Driver/${id}/${fileName}`);
                        //@ts-ignore
                        await uploadBytes(imageRef, image, "data_url");
                        return getDownloadURL(imageRef);
                    })
                );
                updateData[fieldName] = [];
                await setDoc(docRef, updateData, { merge: true });
                updateData[fieldName] = arrayUnion(...downloadURLs);
            } else if (fieldName === 'driverAddress') {
                updateData[fieldName] = JSON.stringify(fieldValue);
            }
            else {
                updateData[fieldName] = fieldValue;
            }
        }

        await setDoc(docRef, updateData, { merge: true });
        return updateData;
    }
    static async ScanForRouteEnd() { // this func check the last element of his arr and then update status of vehicle and driver depened on reoute's endDate
        /* call when :
                + create route ( must call to refresh avaible driver and vehicle) 
                + viewAllDriver
                + viewAvailableDriver
                + viewAllVehicle
                + viewAvailableVehicle
        */
        const driverArray = await (getDocs(DriverRef))
        driverArray.docs.forEach(async (doc) => {
            try {
                let tempUser1 = new DriverOperation()
                const driver = await tempUser1.GetDriver(doc.id)
                if (driver && driver.data.driveHistory) {
                    if (!driver.data.driveHistory[driver.data.driveHistory.length - 1]) throw `invalid ref in history of Driver ${driver}, may be u try to delete route invalidly `
                    const lastRouteID = driver.data.driveHistory[driver.data.driveHistory.length - 1]
                    let tempUser2 = new RouteOperation()
                    const routeObj: Response = (await tempUser2.GetRoute(lastRouteID))
                    const today = new Date()
                    if (routeObj.data) {
                        const endDate = routeObj.data.endDate
                        if (endDate < today && driver.data.driverStatus == 1 && routeObj.data.status == "Active") {
                            console.log(` alraeady check driver ${routeObj.data.driverID}`)
                            const vehicleID = routeObj.data.carID
                            const driverID = routeObj.data.driverID
                            await vehicle.updateVehicle(vehicleID, { status: "Inactive" })
                            await DriverRegister.updateDriver(driverID, { driverStatus: 0 })
                            await trip.UpdateRouteStatus(lastRouteID, "Expired")

                        }
                        else if (routeObj.data.status == "Deleted" && driver.data.driverStatus == 1) {
                            const vehicleID = routeObj.data.carID
                            const driverID = routeObj.data.driverID
                            await vehicle.updateVehicle(vehicleID, { status: "Inactive" })
                            await DriverRegister.updateDriver(driverID, { driverStatus: 0 })
                        }
                    }
                    else
                        throw `  route ${lastRouteID} is null when scan to update status `

                }
            } catch (error) {
                console.log(error)
            }
        })

    }
}
export class DriverOperation {
    constructor() { }
    async createDriver(driverInfo: Driver) {
        let response: Response = {
            error: true,
            data: null
        }
        const driver = new DriverRegister(driverInfo)
        try {
            if (driver) {
                await driver.storeToFB()
                response.error = false
                response.data = driver
            }
        }
        catch (error) {
            console.log(error)
        } finally {
            return response
        }
    }
    async viewAllDriver() {
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        try {
            await DriverRegister.ScanForRouteEnd()
            const driverArray = await (getDocs(DriverRef))
            driverArray.docs.forEach((doc) => {
                result.push({
                    id: doc.id,
                    driverName: doc.data().driverName,
                    driverNumber: doc.data().driverNumber,
                    driverAddress: JSON.parse(doc.data().driverAddress),
                    driverStatus: doc.data().driverStatus,
                    driverLicense: doc.data().driverLicense,
                    driveHistory: doc.data().driveHistory ? doc.data().driveHistory : null,
                })
            })
            if (result) {
                response.error = false
                response.data = result
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            return response
        }
    }
    async viewAvailableDriver() {
        await DriverRegister.ScanForRouteEnd()
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        const q = query(DriverRef, where("driverStatus", "==", 0))
        try {

            const driverArray = await (getDocs(q))

            driverArray.docs.forEach((doc) => {
                result.push({ ...doc.data(), id: doc.id })
            })
            if (result) {
                response.error = false
                response.data = result
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            return response
        }
    }
    async deleteAllDriver() {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            DriverRegister.ScanForRouteEnd()
            const batch = writeBatch(db);
            const querySnapshot = await getDocs(query(DriverRef));

            querySnapshot.forEach((doc) => {
                if (doc.data().driverStatus != "Active")
                    deleteDoc(doc.ref);
                else
                    console.log(`Driver id ${doc.id} is Active, please wait for route end or delete route to delete this driver`)
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
    async deleteDriverByID(driverID: string) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            response.data = await DriverRegister.deleteDriver(driverID)
            response.error = false
        } catch (error) {
            console.log(error)
        }
        finally {
            return response;
        }
    }
    async updateDriverByID(driverID: string, updateField: updateDriver) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            response.data = await DriverRegister.updateDriver(driverID, updateField)
            response.data.id = driverID
            response.error = false
        } catch (error) {
            console.log(error)
        } finally {

            return response;
        }
    }
    async GetDriver(driverId: string) { // if driver dont have his the driveHistory will be undefined
        let response: Response = {
            error: true,
            data: null
        }
        try {
            const driverDoc = await getDoc(doc(db, "Driver", driverId));

            if (driverDoc.exists()) {
                const driverData = driverDoc.data();
                response.data = {
                    driverAddress: JSON.parse(driverData.driverAddress),
                    driverLicense: driverData.driverLicense,
                    driverName: driverData.driverName,
                    driverNumber: driverData.driverNumber,
                    driverStatus: driverData.driverStatus,
                    driveHistory: driverData.driveHistory,
                    id: driverId
                };
                response.error = false;
            }
            else {
                console.log("Driver not found");
            }
        }
        catch (error) {
            console.error("Error retrieving driver:", error);

        } finally {
            return response
        }
    }

};



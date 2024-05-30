import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc
} from 'firebase/firestore';
import { Route, Response, Address, Vehicle, Driver, Observer, CreateRoute } from './libraryType/type';
import { db } from './account';
import { DriverRegister } from './driver';
import { vehicle } from './vehicle';

// Initialize Firebase
const CarRef = collection(db, 'Vehicle');
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');

export class trip {
    id?: string
    begin: Address
    end: Address
    beginDate: Date
    distance: number
    endDate: Date
    licenplate?: string
    DriverNumber?: string
    price: number
    owner?: string
    carID?: string
    carType: string
    carLicensePlate: string
    driverID?: string
    driverName: string
    driver?: string
    task: string
    income: number
    routeProgress: number
    status: string
    constructor(routeInfo: CreateRoute, car: Vehicle | null) {
        if (!car) throw "Không có xe phù hợp, vui lòng tạo mới."
        this.begin = routeInfo.begin
        this.end = routeInfo.end
        this.beginDate = routeInfo.beginDate
        this.driverName = routeInfo.driver.driverName
        this.carType = routeInfo.typeCar
        this.distance = routeInfo.distance
        this.task = routeInfo.task
        routeInfo.car = car;
        this.endDate = this.CaculateEndDate(routeInfo.beginDate, routeInfo.distance, routeInfo.car);
        this.price = this.CalculatePricebyType(routeInfo.distance, routeInfo.typeCar);
        this.status = 'Active'
        this.carLicensePlate = car.licenseplate
        this.income = this.calculateIncome(this.price);
        // 3 cai ham await  va 1 delay maintenance giu nguyen trong create
        this.routeProgress = trip.calculateRouteProgress(routeInfo.beginDate, this.endDate);
        this.carID = car.id
        this.driverID = routeInfo.driver.id
        // Change the maintance date of the car if necessary
        // Create route object   
    }
    async storeToFB() {
        const route = {
            id: '', // This will be auto-generate by Firebase
            begin: this.begin,
            end: this.end,
            beginDate: this.beginDate,
            distance: this.distance,
            endDate: this.endDate,
            carID: this.carID,
            carType: this.carType,
            carLicensePlate: this.carLicensePlate,
            driverID: this.driverID,
            driverName: this.driverName,
            price: this.price,
            task: this.task,
            status: 'Active',
            income: this.income,
            routeProgress: this.routeProgress
        }
        try {
            const docRef = await addDoc(RouteRef, route)
            this.id = docRef.id
            if (this.driverID && this.carID) {
                await trip.UpdateHistoryDriver(this.driverID, this.id)
                // await this.DriverStatusUpdate(this.driverID, 1);
                // await this.CarStatusUpdate(this.carID, "Active");
            }
            else
                throw " missing car or driver id"
        }
        catch (error) {
            console.log(route)
            console.log(error)
        }
    }
    static async UpdateRouteStatus(RouteID: string, Status: string) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            const routeDocRef = doc(RouteRef, RouteID);
            await updateDoc(routeDocRef, {
                status: Status
            });
            response.error = false
            response.data = ("Route status updated successfully");
        }
        catch (error) {
            console.error("Error updating route status:", error);
        }
        finally {
            return response
        }
    }
    static async GetCar(typeCar: string) {
        try {
            const carsSnapshot = await getDocs(collection(db, 'Vehicle'));

            for (const doc of carsSnapshot.docs) {
                const car = doc.data() as Vehicle;
                if (car.type === typeCar && car.status === 'Inactive') {
                    car.id = doc.id
                    return car;
                }
            }
            // If no suitable car found, return null
            return null;
        } catch (error) {
            console.error('Error getting car:', error);
            throw error; // Propagate the error
        }
    }
    async delayMaintenanceDate(car: Vehicle, endDate: Date) {
        console.log("updated delay")
        try { // Check if maintenance day is before the end date
            if (car.maintenanceDay && car.maintenanceDay < endDate) {
                // Set maintenance day to the day after the end date
                const nextDay = new Date(endDate);
                nextDay.setDate(nextDay.getDate() + 1);
                car.maintenanceDay = nextDay;
                if (car.id)
                    await vehicle.updateVehicle(car.id, { maintenanceDay: nextDay })
            }
        }
        catch (error) {
            throw error
        }
    }
    CaculateEndDate(beginDate: Date, distance: number, car: Vehicle) {
        const carVelocity = car.velocity ? car.velocity : 1
        const time = distance / carVelocity;
        const endDate = new Date(beginDate.getTime() + (time * 3600000)); // Convert hours to milliseconds
        return endDate;
    }

    CalculatePricebyType(distance: number, type: string) {
        const prices: { [key: string]: number } = {
            Truck: 2500,
            Bus: 4500,
            ContainerTruck: 3000
        };

        try {
            if (prices[type]) {
                const totalPrice = distance * prices[type];
                return totalPrice;
            } else {
                throw new Error(`Invalid vehicle type: ${type}`);
            }
        } catch (error) {
            console.error("Error calculating price by type:", error);
            throw error;
        }
    }


    calculateIncome(RoutePrice: number) {
        // Assuming income is 5% of the route price
        const incomePercentage = 0.05;
        const income = RoutePrice * incomePercentage;
        return income;
    }

    static calculateRouteProgress(beginDate: Date, endDate: Date) {
        const currentDate = new Date();
        const beginTime = beginDate.getTime();
        const endTime = endDate.getTime();
        const currentTime = currentDate.getTime();
        const totalTime = endTime - beginTime;
        const elapsedTime = currentTime - beginTime;
        // console.log(beginDate)
        // console.log(endDate)

        const progressPercentage = (elapsedTime / totalTime) * 100;
        return Math.min(100, Math.max(0, progressPercentage));
    }

    async DriverStatusUpdate(driverId: string, status: number) {
        try {
            await updateDoc(doc(DriverRef, driverId), {
                driverStatus: status
            });
            console.log("Driver status updated successfully");
        }
        catch (error) {
            console.error("Error updating driver status:", error);
        }
    }

    async CarStatusUpdate(carId: string, status: string) {
        try {
            await updateDoc(doc(CarRef, carId), {
                status: status
            });
            console.log("Car status updated successfully");

        }
        catch (error) {
            console.error("Error updating car status:", error);
        }
    }

    static async UpdateHistoryDriver(driverID: string, RouteId: string) {
        try {
            // Get the document reference of the driver
            const driverDocRef = doc(DriverRef, driverID);
            // Get the current driver data
            const driverDoc = await getDoc(driverDocRef);
            if (!driverDoc.exists()) {
                throw new Error("Driver not found");
            }

            // Update the driveHistory with the new RouteId
            const currentDriveHistory = driverDoc.data().driveHistory || [];
            const updatedDriveHistory = [...currentDriveHistory, RouteId];

            // Update the driver document with the updated driveHistory
            await updateDoc(driverDocRef, {
                driveHistory: updatedDriveHistory
            });

            console.log("Driver history updated successfully");
        }
        catch (error) {
            console.error("Error updating driver history:", error);
            throw error;
        }
    }
}

export class RouteOperation {
    constructor() { }
    async CreateRoute(routeInfo: CreateRoute) {
        let response: Response = {
            error: false,
            data: null
        };
        try {
            const car = await this.GetCar(routeInfo.typeCar);
            if (!car) {
                response.data = "Không có xe phù hợp, vui lòng tạo mới."
                return response;
            }
            const newRoute = new trip(routeInfo, car)
            if (routeInfo.car && routeInfo.car.id)
                await newRoute.CarStatusUpdate(routeInfo.car.id, "Active")
            if (routeInfo.driver && routeInfo.driver.id)
                await newRoute.DriverStatusUpdate(routeInfo.driver.id, 1)
            if (routeInfo.distance)
                await this.CalculatePrice(routeInfo.distance);
            // Create route object
            if (newRoute) {
                await newRoute.storeToFB()
                await newRoute.delayMaintenanceDate(car, newRoute.endDate)
                response.data = newRoute
                response.error = false
            }
        }
        catch (error) {
            response.error = true
            console.log(error)
        }
        finally {
            return response
        }
    }

    async GetRoute(routeId: string) {
        let response: Response = {
            error: true,
            data: null
        }
        try {

            const routeDoc = await getDoc(doc(db, "Route", routeId));

            if (routeDoc.exists()) {
                const routeData = routeDoc.data();
                const beginDate = new Date(routeData.beginDate.seconds * 1000);
                const endDate = new Date(routeData.endDate.seconds * 1000);
                const progress = trip.calculateRouteProgress(beginDate, endDate);

                response.data = {
                    id: routeId,
                    distance: routeData.distance,
                    car: routeData.car,
                    driver: routeData.driver,
                    price: routeData.price,
                    task: routeData.task,
                    status: routeData.status,
                    begin: routeData.begin,
                    end: routeData.end,
                    beginDate: beginDate,
                    endDate: endDate,
                    carID: routeData.carID,
                    carLicensePlate: routeData.carLicensePlate,
                    carType: routeData.carType,
                    driverID: routeData.driverID,
                    driverName: routeData.driverName,
                    income: routeData.income,
                    routeProgress: progress
                };
                response.error = false
            }
            else {
                throw "Route not found";
            }
        }
        catch (error) {
            console.log("Error retrieving route:", error);

        }
        finally {
            return response
        }
    }

    async viewAllRoute() {
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        try {
            await DriverRegister.ScanForRouteEnd();
            const routeArray = await (getDocs(RouteRef));
            const currentTime = new Date();
            routeArray.docs.forEach(async (doc) => {
                const beginDate = new Date(doc.data().beginDate.seconds * 1000);
                const endDate = new Date(doc.data().endDate.seconds * 1000);
                const progress = trip.calculateRouteProgress(beginDate, endDate);

                result.push({
                    begin: doc.data().begin,
                    end: doc.data().end,
                    beginDate: new Date(doc.data().beginDate.seconds * 1000),
                    endDate: new Date(doc.data().endDate.seconds * 1000),
                    carID: doc.data().carID,
                    carLicensePlate: doc.data().carLicensePlate,
                    carType: doc.data().carType,
                    driverID: doc.data().driverID,
                    driverName: doc.data().driverName,
                    price: doc.data().price,
                    id: doc.id,
                    status: doc.data().status,
                    routeProgress: progress,
                    income: doc.data().income,
                    distance: doc.data().distance
                })
            })
            if (result) {
                response.data = result
                response.error = false
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            return response
        }
    }


    async deleteRouteByID(routeID: string) {
        try {
            const routeDoc = await getDoc(doc(db, 'Route', routeID));
            if (!routeDoc.exists()) {
                return { error: true, data: "Route not found" };
            }

            //    update the route's status into "Deleted"
            const routeRef = doc(db, 'Route', routeID);
            await updateDoc(routeRef, {
                status: "Deleted"
            });

            return { error: false, data: "Route deleted successfully" };
        }
        catch (error) {
            console.log("Error deleting route:", error);
            return { error: true, data: error };
        }
    }

    async RecommendDriver() {
        let response: Response = {
            error: false,
            data: []
        };
        try {
            const querySnapshot = await getDocs(DriverRef);
            const drivers: Driver[] = [];
            querySnapshot.forEach((doc) => {
                const driverData = doc.data() as Driver;
                driverData.id = doc.id
                // Filter drivers that have driverStatus available
                if (driverData.driverStatus === 0) {
                    drivers.push(driverData);
                }
            });
            // Sort drivers based on the number of routes in driveHistory
            drivers.sort((a, b) => (a.driveHistory?.length || 0) - (b.driveHistory?.length || 0));

            console.log(drivers)
            if (drivers.length === 0) {
                return response;
            } else {
                response.data = drivers.slice(0, 3);
            }
        } catch (error) {
            response.error = true;
        }
        finally {
            return response;
        }
    }
    async GetCar(typeCar: string) {
        try {
            const carsSnapshot = await getDocs(collection(db, 'Vehicle'));

            for (const doc of carsSnapshot.docs) {
                const car = doc.data() as Vehicle;
                if (car.type === typeCar && car.status === 'Inactive') {
                    car.id = doc.id
                    return car;
                }
            }
            // If no suitable car found, return null
            return null;
        } catch (error) {
            console.log('Error getting car:', error);
            throw error; // Propagate the error
        }
    }
    async CalculatePrice(distance: number) {
        const prices: { [key: string]: number } = {
            Truck: 2500,
            Bus: 4500,
            ContainerTruck: 3000
        };

        let response: Response = {
            error: false,
            data: {}
        };
        try {
            for (const vehicleType in prices) {
                if (Object.prototype.hasOwnProperty.call(prices, vehicleType)) {
                    const price = distance * (prices[vehicleType as keyof typeof prices] || 1);
                    response.data[vehicleType] = price;
                }
            }
        } catch (error) {
            console.log("Error calculating fees:", error);
            response.error = true;
        }
        finally {
            return response;
        }
    }

};
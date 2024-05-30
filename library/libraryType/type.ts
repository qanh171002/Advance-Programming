
export interface Address {
    latitude: number,
    longitude: number,
    address: string
}
export interface Driver {
    // type: string,
    //change here when we have updateIMG func
    driveHistory?: string[],               // Json string of route id
    driverName: string,
    driverNumber: string,
    driverAddress: Address,
    driverStatus?: number,
    driverLicense: Blob[]
    id?: string,
}

export interface Vehicle {
    id?: string,
    type: string
    licenseplate: string,
    enginefuel?: string,
    height?: string,
    length?: string,
    width?: string,
    mass?: string,
    status?: string,
    price?: number,
    velocity?: number,
    maintenanceDay?: Date,
}

export interface Response {
    error: boolean,
    data?: any
}

export interface SignUp {
    email: string,
    password: string
}

export interface ForgotPass {
    email: string,
}
export interface updateVehicle {
    type?: string
    licenseplate?: string,
    enginefuel?: string,
    height?: string,
    length?: string,
    width?: string,
    mass?: string,
    status?: string,
    price?: number,
    velocity?: number,
    maintenanceDay?: Date,
}
export interface updateDriver {
    // type: string,
    //change here when we have updateIMG func
    driveHistory?: string[],               // we can cal experience by check the length of this
    driverName?: string,
    driverNumber?: string,
    driverAddress?: Address,
    driverStatus?: number,
    driverLicense?: Blob[]
}
export interface Route {
    id: string
    begin: Address,
    end: Address,
    beginDate: Date,
    distance: number,
    endDate?: Date,
    licenplate?: string,
    DriverNumber?: string,
    price: number,
    owner?: string,
    carID?: string,
    carType: string,
    carLicensePlate: string,
    driverID?: string,
    driverName: string,
    driver?: string,
    task: string
    income: number;
    routeProgress: number,
    status: string,
}
export interface CreateRoute {
    begin: Address,
    end: Address,
    distance: number,
    beginDate: Date,
    driver: Driver,
    task: string,
    typeCar: string,
    car?: Vehicle
}
export interface Observer {
    update(route: Route): void;
}
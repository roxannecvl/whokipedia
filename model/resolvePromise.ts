export type PromiseState = {
    promise: Promise<any> | null,
    data: any | null,
    error: string | null
}

/**
 * @credits : comes from the tutorial of the course "Interaction Programming and the Dynamic Web" by KTH University.
 * Saves promise results in a `state` object (typically held in the Model), so that the results can be shown in the UI.
 * @param prms : Promise promise to resolve
 * @param promiseState : PromiseState state object of the Model
 */
export function resolvePromise(prms : Promise<any>, promiseState : PromiseState) : void{
    console.log("promise");

    // Checks for null promise
    if(prms === null) return;

    promiseState.promise = prms;
    promiseState.data = null;
    promiseState.error = null;

    prms.then(dataACB).catch(errorACB);

    function dataACB(res : any){
        // Address race conditions
        if(promiseState.promise === prms){
            promiseState.data = res;
            console.log("data set")
            console.log(promiseState.data)
        }
    }
    function errorACB(error : string){
        // Address race conditions
        if(promiseState.promise === prms) {
            promiseState.error = error;
        }
        console.log("promise done")
    }
}

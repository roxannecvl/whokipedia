/**
 * @credits : comes from the tutorial
 * Saves promise results in a `state` object (typically held in the Model),
 * so that the results can be shown in the UI.
 * @param prms : Promise promise to resolve
 * @param promiseState state object of the Model
 */
export function resolvePromise(prms : Promise<any>, promiseState : any){

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
        }
    }
    function errorACB(error : string){
        // Address race conditions
        if(promiseState.promise === prms) {
            promiseState.error = error;
        }
    }
}

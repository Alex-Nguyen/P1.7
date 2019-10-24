//
//  ViewController.swift
//  HealthKitForClass
//
//  Created by Vinh Nguyen on 10/19/19.
//  Copyright © 2019 Vinh Nguyen. All rights reserved.
//

import UIKit
import HealthKit
import Firebase
import FirebaseDatabase
let healthKitStore:HKHealthStore = HKHealthStore()
var ref: DatabaseReference!

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view
        
    }
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
            
        
    }
    func displayAlert(title:String, message:String){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)

        alertController.addAction(UIAlertAction(title: "OK", style: .cancel, handler: nil))
        present(alertController, animated: true, completion: nil)
    }
    
    
    @IBAction func updateSleep(_ sender: Any) {
        print("Update sleep analysis")
        guard let sleepDataType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
            fatalError("Unable to get Sleep Analysis type")
        }
        ref = Database.database().reference()
        let formatter = DateFormatter()
        formatter.dateFormat = "dd-MMM-yyyy"

        var interval = DateComponents()
        interval.day = 1
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)

        let query = HKSampleQuery(sampleType: sleepDataType, predicate: nil, limit: 5, sortDescriptors: [sortDescriptor]) { (_, results, error) in
            if error != nil {
                // Handle the error in your app gracefully
                print("No record foud")
                return
            }
            if let result = results {
               for item in result {
                    if let sample = item as? HKCategorySample {
                        let myStringafd = formatter.string(from: sample.startDate)
                        let sleepTimeForOneDay = sample.endDate.timeIntervalSince(sample.startDate)
                        print("Time: \(sample.startDate), \(sleepTimeForOneDay)")
                        ref.child("vinh-sleep").child(myStringafd).setValue(sleepTimeForOneDay)
                    }
                }
            }
        }
        
        healthKitStore.execute(query)
        
        
    }
    @IBAction func UpdateStepCount(_ sender: Any) {
        self.getStepCountWithRange()
    }
    
    
    @IBAction func updateHeartRate(_ sender: Any) {
        ref = Database.database().reference()
        let formatter = DateFormatter()
        formatter.dateFormat = "dd-MMM-yyyy"

        
        guard let walkingRunningType = HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning) else {
            fatalError("Unable to get heart Rate type")
        }
        var interval = DateComponents()
        interval.day = 1
        
        let today = Date()
        let calendar = Calendar.current
        let anchorDate = calendar.date(byAdding: .day, value: -4, to: today)!
        
        let query = HKStatisticsCollectionQuery.init(quantityType: walkingRunningType, quantitySamplePredicate: nil, options: .cumulativeSum, anchorDate: anchorDate, intervalComponents: interval)
        query.initialResultsHandler = {
            query, results, error in
            
            let startDate = anchorDate
            results?.enumerateStatistics(from: startDate, to: today, with: { (result, stop) in
                let myStringafd = formatter.string(from: result.startDate)

                let walkingRunning = result.sumQuantity()?.doubleValue(for: HKUnit.mile()) ?? 0
//                print( result)
//                print("Time: \(result.startDate), \(walkingRunning)")
                ref.child("vinh-walkingRunning").child(myStringafd).setValue(walkingRunning)
            })
            
        }
        healthKitStore.execute(query)
        
    }
    
    func getStepCountWithRange(){

        ref = Database.database().reference()
        let formatter = DateFormatter()
        formatter.dateFormat = "dd-MMM-yyyy"

        
        guard let stepCountType = HKObjectType.quantityType(forIdentifier: .stepCount) else {
            fatalError("Unable to get step count type")
        }
        print("We are here multiple step counts")
        var interval = DateComponents()
        interval.day = 1
        
        let today = Date()
        let calendar = Calendar.current
        let anchorDate = calendar.date(byAdding: .day, value: -4, to: today)!
        
        let query = HKStatisticsCollectionQuery.init(quantityType: stepCountType, quantitySamplePredicate: nil, options: .cumulativeSum, anchorDate: anchorDate, intervalComponents: interval)
        query.initialResultsHandler = {
            query, results, error in
            
            let startDate = anchorDate
            results?.enumerateStatistics(from: startDate, to: today, with: { (result, stop) in
                let myStringafd = formatter.string(from: result.startDate)

                let stepCount = result.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0
                print( myStringafd,stepCount)
                print("Time: \(result.startDate), \(stepCount)")
                ref.child("vinh-steps").child(myStringafd).setValue(stepCount)
            })
            
        }
        healthKitStore.execute(query)
        
        
    }
    func getTodayStep(){
        print("Function run here")
        let stepQuantityType = HKQuantityType.quantityType(forIdentifier: .stepCount)!
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now, options: .strictStartDate)
        
        let query = HKStatisticsQuery.init(quantityType: stepQuantityType, quantitySamplePredicate: predicate, options: .cumulativeSum) { (_, result, error) in
            var resultCount = 0.0
            guard let result = result else{
                print("No record found !")
                return
            }
            
            if let sum = result.sumQuantity(){
                resultCount = sum.doubleValue(for: HKUnit.count())
                print(resultCount)
            }
        }
        healthKitStore.execute(query)
    }
    
    @IBAction func requestAuthorizeHK(_ sender: Any) {
        let healthKitTypesToRead: Set<HKObjectType> = [
            HKObjectType.categoryType(forIdentifier: HKCategoryTypeIdentifier.sleepAnalysis)!,
            HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
            HKObjectType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.characteristicType(forIdentifier: HKCharacteristicTypeIdentifier.dateOfBirth)!,
            HKObjectType.characteristicType(forIdentifier: HKCharacteristicTypeIdentifier.bloodType)!,
        ]
        
        let healthKitTypesToWrite: Set<HKSampleType> = []
        if(!HKHealthStore.isHealthDataAvailable()){
            print("Application is not available in this device")
            return
        }
        healthKitStore.requestAuthorization(toShare: healthKitTypesToWrite, read: healthKitTypesToRead) { (Bool, Error) -> Void in
            print("Access to HK database successfully!")
        }
        
    }
    
    

}


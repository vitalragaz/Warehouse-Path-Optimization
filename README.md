# Nearest Distance Optimization vs. Ant Colony Optimization in a Multi Aisle Warehouse

## Description
Today warehouses and the IT infrastructure behind them ensure within all supply chains a smooth processing of numbers of orders coming in all day long from customers located all over the world. These orders can consist of one item up to hundreds of items. The variety in size ware-houses have today is also not contributing in finding the best optimization method to process all these orders as fast as possible. 

This repo is comparing the nearest distance optimization with the ant colony optimization in the context of weather one or the other is delivering faster picking times in several scenarios depending on the warehouse size ore the number of items on the picking list. 

* Demo: https://fhnw-aci-2020.herokuapp.com/
* Repo: https://github.com/vitalragaz/Warehouse-Path-Optimization

![Demo](https://i.imgur.com/AxTIgYd.png)

## Setup
Prerequisite:
* npm
* nodejs
* The viewport of the device must be at least 1920x1280

The project can be run by doing the following steps:
* Clone the repository localy
* Install the required packages with `npm i`
* Build the project with `npm run build` 
* Spin up the wheel with `npm run start` 
* Open  `localhost:3000` in a ES6 compatible browser


## Credits
### General
This repository used the work from Flur3x: https://github.com/Flur3x/Warehouse-Path-Optimization as a basis.
### ACO
Goes to alextanhongpin for the ACO: https://github.com/alextanhongpin/evolutionary-algorithms implementation with vanilla js.
### Shortest Distance
The calculation is based on the findings of: E. Zunic, A. Besirevic, R. Skrobo, H. Hasic, K. Hodzic and A. Djedovic, "Design of optimization system for warehouse order picking in real environment," 2017 XXVI International Conference on Information, Communication and Automation Technologies (ICAT), Sarajevo, 2017, pp. 1-6 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  results: any[];
  previousQuery: string;
  constructor(private http: HttpClient) { 
    this.results = new Array();
  }

  wipe() {
    this.results = new Array();
  }

  populate(query: string) {
    if (this.previousQuery && query == this.previousQuery) {
      return new Promise((resolve) => {
        resolve(this.results);
      });
    } else {
      this.wipe();
      let data = this.getQuery(query);
      return new Promise((resolve) => {
        data.then((result) => {
          if (Array.isArray(result)) {
            this.results = result;
            this.previousQuery = query;
            resolve(this.results);
          }
        });
      });
    }
  }

  async getQuery(query) {
    let url = "https://rxlhaqtsbl.execute-api.us-east-2.amazonaws.com/v1/populate/?query=" + query;
    let req = this.http.get(url);
    let results = new Promise((resolve) => {
      req.subscribe((data) => {
        resolve(JSON.parse(data.toString()));
      })
    });
    return results;
  }

  getResults() {
    return this.results;
  }

  getItem(id: number) {
    return this.populate(`SELECT * FROM dataTable WHERE id = ${id}`);
  }
}

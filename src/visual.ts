"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private textNode: Text;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.updateCount = 10;
        if (document) {
            const new_p: HTMLElement = document.createElement("p");
            const inp: HTMLInputElement = document.createElement("input");
            const btn: HTMLElement = document.createElement("button");
            btn.textContent = "Get Insight";
            btn.onclick = () => {
                this.updateCount++;
                this.textNode.textContent = this.updateCount.toString();
                // const insight: HTMLElement = document.createElement("p");
                // insight.appendChild(document.createTextNode("Insight:"+this.updateCount++));
                // this.target.appendChild(insight);
                this.dummyAPICall(this.target, inp.value);
            };
            new_p.appendChild(document.createTextNode("Update count:"));
            const new_em: HTMLElement = document.createElement("em");
            this.textNode = document.createTextNode(this.updateCount.toString());
            new_em.appendChild(this.textNode);
            new_p.appendChild(new_em);
            new_p.appendChild(inp);
            new_p.appendChild(btn);
            this.target.appendChild(new_p);

            setInterval(() => {
                this.updateCount++;
                this.textNode.textContent = this.updateCount.toString();
            }, 1000);
        }
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);

        console.log('Visual update', options);
        if (this.textNode) {
            this.textNode.textContent = (this.updateCount++).toString();
        }
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    public dummyAPICall(target: HTMLElement, id:any) {
        // Create an instance of the XMLHttpRequest object
        var xhr = new XMLHttpRequest();
      
        // Define the API endpoint URL
        var url = 'https://jsonplaceholder.typicode.com/comments/';
      
        // Set the HTTP method and URL
        xhr.open('GET', url+ id, true);
      
        // Set the request header if required (e.g., for authentication)
        // xhr.setRequestHeader('Authorization', 'Bearer YOUR_ACCESS_TOKEN');
      
        // Define the callback function to handle the API response
        xhr.onload = ()=> {
          if (xhr.status === 200) {
            // Callback function to handle the response
            var data = this.handleAPISuccess(xhr.response);
            const insight: HTMLElement = document.createElement("p");
                insight.appendChild(document.createTextNode(data.body));
                this.target.appendChild(insight);
          } else {
            // Callback function to handle errors
            var data = this.handleAPIError(xhr.status, xhr.statusText);
          }
        };
      
        // Optional: Define an error callback
        xhr.onerror = function() {
          console.error('Error making API call.');
        };
      
        // Send the request
        xhr.send();
      }
      
      // A callback function to handle a successful API response
      public handleAPISuccess(response):any {
        // Convert the response data to JSON (if required)
        var data = JSON.parse(response);
      
        // Do something with the response data
        console.log(data);
        return data;
      }
      
      // A callback function to handle API errors
      public handleAPIError(status, statusText):any {
        console.error('API request failed with status:', status, statusText);
        return status;
      }
}
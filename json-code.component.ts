import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
   selector: 'app-json-code',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './json-code.component.html',
   styleUrls: ['./json-code.component.scss']
})
export class JsonCodeComponent implements OnInit {
   public jsonHTML = ''
   @Input() jsonObject: any

   ngOnInit(): void {
      this.generateHTMLFromJSON(this.jsonObject)
   }

   private generating = false

   generateHTMLFromJSON(data: any) {
      if (!this.generating) {
         this.generating = true

         let html = '<pre><code>{\n'
         html += this.createHTMLFromObject(data, 0) // Start with indentation level 0
         html += '}</code></pre>'

         this.generating = false
         this.jsonHTML = html
      }
   }

   private createHTMLFromObject(data: any, level: number): string {
      let html = '' // Initialize HTML
      const indent = '  '.repeat(level) // Indentation string based on level

      if (data && typeof data === 'object') {
         if (Array.isArray(data)) {
            html += this.createHTMLFromArray(data, level)
         } else {
            html += indent + '<p>'
            html += this.createHTMLFromArray(data, level)
            html += '</p>'
         }
      }
      return html
   }

   private createHTMLFromArray(data: any, level: number): string {
      let html = '' // Initialize HTML
      const indent = '  '.repeat(level + 1) // Increase indentation for nested objects
      let iteration = 1

      for (const key in data) {
         const arrayLength = data.length ? data.length : 0
         const objectLength = Object.keys(data).length
            ? Object.keys(data).length
            : 0

         if (data.hasOwnProperty(key)) {
            html += indent + '<span class="json-key">"' + key + '":</span> '
            if (typeof data[key] === 'object') {
               if (Array.isArray(data[key])) {
                  // Check if it's an array of simple values or objects
                  if (
                     data[key].every((item: any) => typeof item !== 'object')
                  ) {
                     html += this.setJsonArray(
                        data[key],
                        objectLength > iteration
                     )
                  } else {
                     html += '[\n'
                     html += this.createHTMLFromObject(data[key], level + 1) // Recursive call with increased level
                     html += indent + ']\n' // End of array with new lines
                  }
               } else {
                  html += '{<p>' // Start of object with new lines
                  html += this.createHTMLFromArray(data[key], level + 1) // Recursive call with increased level
                  html +=
                     arrayLength > iteration
                        ? indent + '},</p>'
                        : indent + '}</p>'
               }
               // set JSON Values with colorations
            } else {
               switch (this.detectDataKeyType(data[key])) {
                  case 'string':
                     html += this.setJsonString(
                        data[key],
                        objectLength > iteration
                     )
                     break
                  case 'number':
                     html += this.setJsonNumber(
                        data[key],
                        objectLength > iteration
                     )
                     break
                  case 'boolean':
                     html += this.setJsonBoolean(
                        data[key],
                        objectLength > iteration
                     )
                     break
                  default:
                     html += this.setJsonString(
                        data[key],
                        objectLength > iteration
                     )
                     break
               }
            }
         }

         iteration++
      }
      return html
   }

   private detectDataKeyType(key: any): string {
      if (typeof key === 'string') {
         return 'string'
      } else if (typeof key === 'number') {
         return 'number'
      } else if (typeof key === 'boolean') {
         return 'boolean'
      }
   }

   private setJsonString(key: any, semicolon: boolean): string {
      return (
         '<span class="json-value-string">"' +
         key +
         '"</span>' +
         (semicolon ? ',' : '') +
         '\n'
      )
   }

   private setJsonNumber(key: any, semicolon: boolean): string {
      return (
         '<span class="json-value-number">' +
         key +
         '</span>' +
         (semicolon ? ',' : '') +
         '\n'
      )
   }

   private setJsonBoolean(key: any, semicolon: boolean): string {
      return (
         '<span class="json-value-boolean">' +
         key +
         '</span>' +
         (semicolon ? ',' : '') +
         '\n'
      )
   }

   private setJsonArray(key: any, semicolon: boolean): string {
      return (
         '[<span class="json-value-string">"' +
         key.join('", "') +
         '"</span>]' +
         (semicolon ? ',' : '') +
         '\n'
      )
   }
}

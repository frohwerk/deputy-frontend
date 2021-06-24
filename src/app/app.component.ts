import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  username?: string

  givenName?: string

  constructor(readonly router: Router) { }

  ngOnInit(): void {
    const cookies = parseCookies(document.cookie)
    const payload = cookies["claims"]
    console.log(payload)
    if (payload) {
      try {
        const decoded = atob(payload)
        console.log(decoded)
        const claims = JSON.parse(decoded)
        this.givenName = claims?.given_name
        this.username = claims?.preferred_username
      } catch(err) {
        console.log(err)
      }
    }
  }

}

function parseCookies(s: string): Map<string, string> {
  const map = new Map<string, string>()
  document.cookie
    .split(";")
    .map(v => v?.trim())
    .map(v => v.split("=", 2))
    .filter(v => v[0])
    .forEach(v => map[v[0]] = v[1] ? v[1] : "")
  return map;
}

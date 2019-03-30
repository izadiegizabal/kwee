import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import * as fromAdmin from '../../admin/store/admin.reducers';
import {MatPaginator, MatSidenav, PageEvent} from '@angular/material';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as AdminActions from '../../admin/store/admin.actions';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-search-candidates',
  templateUrl: './search-candidates.component.html',
  styleUrls: [
    '../../candidate-home/candidate-home.component.scss',
    './search-candidates.component.scss',
  ]
})
export class SearchCandidatesComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;
  query: any;
  adminState: Observable<fromAdmin.State>;
  // paging
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  // MatPaginator Output
  pageEvent: PageEvent;
  orderby = '0';
  order: { value: string, viewValue: string }[] =
    [
      {value: '0', viewValue: 'Relevance'},
      {value: 'index', viewValue: 'Kwee Index'},
      {value: 'name', viewValue: 'Name'},
      {value: 'dateBorn', viewValue: 'Date Born'},
    ];
  // Filter sidebar
  @ViewChild('drawer') private drawer: MatSidenav;

  constructor(
    private titleService: Title,
    private store$: Store<fromApp.AppState>,
    public media: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Search Candidates');

    this.store$.dispatch(new AdminActions.TryGetCandidates({
      page: 1,
      limit: 5,
      params: this.query,
      order: this.orderby
    }));
    this.adminState = this.store$.pipe(select(state => state.admin));

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.query = params;
        this.searchCallApi();
      });
  }

  changePage() {
    this.store$.dispatch(new AdminActions.TryGetCandidates({
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
      params: this.query,
      order: this.orderby
    }));
    window.scrollTo(0, 0);
  }

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 960px)'); // gt-sm
  }

  applyFilters() {
    this.drawer.toggle();
    window.scrollTo(0, 0);
  }

  onSearch(params: string) {
    let searchParams = params.toLowerCase().replace(/ /g, '+');
    if (!searchParams) {
      searchParams = null;
    } else {
      this.titleService.setTitle('Kwee - ' + searchParams);
    }
    this.router.navigate(['/search-candidates'], {queryParams: {keywords: searchParams}, queryParamsHandling: 'merge'});
  }

  getOrderby(order: string) {
    // console.log(order);
    this.orderby = order;

    this.store$.dispatch(new AdminActions.TryGetCandidates({
      page: 1,
      limit: this.pageSize,
      params: this.query,
      order: this.orderby
    }));
  }


  searchCallApi() {
    if (this.query.index) {
      this.query = {...this.query, index: {'gte': this.query.index}};
    }

    if (this.query.dateBorn) {
      const dateBorn = this.query.dateBorn.split(':');
      let paramDate;

      if (dateBorn.length === 4) {
        paramDate = {
          lte: dateBorn[1],
          gte: dateBorn[3],
        };
      } else {
        if (dateBorn[0] === 'lte') {
          paramDate = {
            lte: dateBorn[1],
          };
        } else {
          paramDate = {
            gte: dateBorn[1],
          };
        }
      }

      this.query = {...this.query, dateBorn: paramDate};
    }

    // console.log(this.query);

    if (this.query.skills) {
      const skills = [];
      const aux = [];
      aux.push(this.query.skills);

      for (let i = 0; i < aux.length; i++) {
        skills.push({
          name: aux[i]
        });
      }

      this.query = {...this.query, skills: skills};
    }

    if (this.query.languages) {
      const languages = [];
      const aux = [];
      aux.push(this.query.languages);

      for (let i = 0; i < aux.length; i++) {
        languages.push({
          name: aux[i]
        });
      }

      this.query = {...this.query, languages: languages};
    }


    this.store$.dispatch(new AdminActions.TryGetCandidates({
      page: 1,
      limit: this.pageSize,
      params: this.query,
      order: this.orderby
    }));

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

}

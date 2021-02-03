import { Controller } from "@Controller";
import { ArchitectureService } from "~Services/Architecture";
import { Test1Service } from "~Services/Test1";
import { Test2Service } from "~Services/Test2";
import { Test3Service } from "~Services/Test3";

@Controller.define()
export class HomeController extends Controller {
    constructor(
        private _architectureService: ArchitectureService,
        private _test1Service: Test1Service,
        private _test2Service: Test2Service,
        private _test3Service: Test3Service
    ) {
        super();
    }

    public Index() {
        console.log(this._architectureService);
        return this.View();
    }
}
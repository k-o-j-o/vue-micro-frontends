import { Controller } from "@Controller";

export class HomeController extends Controller {
    public Index() {
        return this.View();
    }
}
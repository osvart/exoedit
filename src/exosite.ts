"use strict";

import fetch from "./fetch";
import {expectStatus200} from "./fetch";
import {concatWithSlash} from "./utilities";

export interface ExositeAccount {
    id: number;
}

export default class{
    constructor(private domain: string, userName: string, password: string) {
        this.account = {
            userName: userName,
            password: password
        };
    }

    private account: { userName: string; password: string};

    public getExositeAccount(): Promise<ExositeAccount> {
        const options = {
            auth: this.account,
            url: this.getUrl("accounts/" + this.account.userName)
        };
        return fetch(options)
            .then(expectStatus200)
            .then(result => {
                return JSON.parse(result.body);
            });
    }

    public getPortals(userId: number): Promise<Portal[]> {
        const options = {
            auth: this.account,
            url: this.getUrl("users/" + userId.toString() + "/portals")
        };
        return fetch(options)
            .then(expectStatus200)
            .then(result => {
                return JSON.parse(result.body);
            });
    }

    public getDomainWidgetScript(widgetScriptId: string): Promise<DomainWidgetScript> {
        const options = {
            auth: this.account,
            url: this.getUrl("widget-scripts/" + widgetScriptId)
        };
        return fetch(options)
            .then(expectStatus200)
            .then(result => {
                return JSON.parse(result.body);
            });
    }

    public getDomainWidgetScripts(): Promise<DomainWidgetScript[]> {
        const options = {
            auth: this.account,
            url: this.getUrl("widget-scripts")
        };
        return fetch(options)
            .then(expectStatus200)
            .then(result => {
                return JSON.parse(result.body);
            });
    }

    public updateDomainWidgetScript(widgetScriptId: string, data: any) {
        const options = {
            auth: this.account,
            method: "PUT",
            url: this.getUrl("widget-scripts/" + widgetScriptId),
            json: true,
            body: data
        };
        return fetch(options)
            .then(expectStatus200);
    }

    public getDashboards(portalId: string): Promise<Dashboard[]> {
        const options = {
            auth: this.account,
            url: this.getUrl("portals/" + portalId + "/dashboards")
        };
        return fetch(options)
            .then(expectStatus200)
            .then(result => {
                return JSON.parse(result.body);
            });
    }

    public updateDashboard(dashboardId: string, data: any) {
        const options = {
            auth: this.account,
            method: "PUT",
            url: this.getUrl("dashboards/" + dashboardId),
            json: true,
            body: data
        };

        return fetch(options)
            .then(expectStatus200);
    }

    public getDashboard(dashboardId: string): Thenable<Dashboard> {
        const options = {
            auth: this.account,
            url: this.getUrl("dashboards/" + dashboardId)
        };
        return fetch(options)
            .then(expectStatus200)
            .then(result => {
                return JSON.parse(result.body);
            });
    }

    public getDevices(portalId: string): Thenable<Device[]> {
        const options = {
            auth: this.account,
            url: this.getUrl("portals/" + portalId + "/devices")
        };
        return fetch(options)
            .then(expectStatus200)
            .then(result => {
                return JSON.parse(result.body);
            });
    }

    public getDeviceLuaScripts(deviceRid: string): Thenable<LuaScript[]> {
        const options = {
            auth: this.account,
            url: this.getUrl("devices/" + deviceRid + "/scripts")
        };
        return fetch(options)
            .then(expectStatus200)
            .then(result => {
                return JSON.parse(result.body);
            });
    }

    private getUrl(suffix: string) {
        return concatWithSlash("https://" + this.domain, concatWithSlash("api/portals/v1", suffix));
    }

    public updateLuaScript(rid: string, script: string) {
        const options = {
            auth: this.account,
            method: "PUT",
            url: this.getUrl("scripts/" + rid),
            json: true,
            body: {
                info: {
                    description: {
                        rule: {
                            script: script
                        }
                    }
                }
            }
        };

        return fetch(options)
            .then(expectStatus200);
    }
}

export interface Portal {
    PortalName: string;
    PortalID: string;
}

export interface Dashboard {
    id: string;
    name: string;
    config: {
        widgets: {[id: number]: DashboardWidget}
    };
}

export interface DashboardWidget {
    title: string;
    script: string;
    WidgetScriptID: string;
}


export interface DomainWidgetScript {
    code: string;
    description: string;
    id: string;
    name: string;
}

export interface Device {
    rid: string;
    info: {
        description: {
            name: string;
        }
    };
    sn: string;
}

export interface LuaScript {
    rid: string;
    info: {
        description: {
            name: string;
            rule: {
                script: string;
            }
        }
    };
}
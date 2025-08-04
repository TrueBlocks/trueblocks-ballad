export namespace base {
	
	export class Address {
	    address: number[];
	
	    static createFrom(source: any = {}) {
	        return new Address(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = source["address"];
	    }
	}
	export class Hash {
	    hash: number[];
	
	    static createFrom(source: any = {}) {
	        return new Hash(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hash = source["hash"];
	    }
	}

}

export namespace crud {
	
	export enum Operation {
	    CREATE = "create",
	    UPDATE = "update",
	    DELETE = "delete",
	    UNDELETE = "undelete",
	    REMOVE = "remove",
	    AUTONAME = "autoname",
	}

}

export namespace exports {
	
	export class ExportsPage {
	    facet: types.DataFacet;
	    assets: types.Name[];
	    balances: types.Token[];
	    logs: types.Log[];
	    receipts: types.Receipt[];
	    statements: types.Statement[];
	    traces: types.Trace[];
	    transactions: types.Transaction[];
	    transfers: types.Transfer[];
	    withdrawals: types.Withdrawal[];
	    totalItems: number;
	    expectedTotal: number;
	    isFetching: boolean;
	    state: types.LoadState;
	
	    static createFrom(source: any = {}) {
	        return new ExportsPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.assets = this.convertValues(source["assets"], types.Name);
	        this.balances = this.convertValues(source["balances"], types.Token);
	        this.logs = this.convertValues(source["logs"], types.Log);
	        this.receipts = this.convertValues(source["receipts"], types.Receipt);
	        this.statements = this.convertValues(source["statements"], types.Statement);
	        this.traces = this.convertValues(source["traces"], types.Trace);
	        this.transactions = this.convertValues(source["transactions"], types.Transaction);
	        this.transfers = this.convertValues(source["transfers"], types.Transfer);
	        this.withdrawals = this.convertValues(source["withdrawals"], types.Withdrawal);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.isFetching = source["isFetching"];
	        this.state = source["state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace keys {
	
	export class Accelerator {
	    Key: string;
	    Modifiers: string[];
	
	    static createFrom(source: any = {}) {
	        return new Accelerator(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Key = source["Key"];
	        this.Modifiers = source["Modifiers"];
	    }
	}

}

export namespace menu {
	
	export class Menu {
	    Items: MenuItem[];
	
	    static createFrom(source: any = {}) {
	        return new Menu(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Items = this.convertValues(source["Items"], MenuItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MenuItem {
	    Label: string;
	    Role: number;
	    Accelerator?: keys.Accelerator;
	    Type: string;
	    Disabled: boolean;
	    Hidden: boolean;
	    Checked: boolean;
	    SubMenu?: Menu;
	
	    static createFrom(source: any = {}) {
	        return new MenuItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Label = source["Label"];
	        this.Role = source["Role"];
	        this.Accelerator = this.convertValues(source["Accelerator"], keys.Accelerator);
	        this.Type = source["Type"];
	        this.Disabled = source["Disabled"];
	        this.Hidden = source["Hidden"];
	        this.Checked = source["Checked"];
	        this.SubMenu = this.convertValues(source["SubMenu"], Menu);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class CallbackData {
	    MenuItem?: MenuItem;
	
	    static createFrom(source: any = {}) {
	        return new CallbackData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.MenuItem = this.convertValues(source["MenuItem"], MenuItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

export namespace msgs {
	
	export enum EventType {
	    STATUS = "statusbar:status",
	    ERROR = "statusbar:error",
	    MANAGER = "manager:change",
	    DATA_LOADED = "data:loaded",
	    TAB_CYCLE = "hotkey:tab-cycle",
	    IMAGES_CHANGED = "images:changed",
	    PROJECT_OPENED = "project:opened",
	}

}

export namespace preferences {
	
	export class Bounds {
	    x: number;
	    y: number;
	    width: number;
	    height: number;
	
	    static createFrom(source: any = {}) {
	        return new Bounds(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.x = source["x"];
	        this.y = source["y"];
	        this.width = source["width"];
	        this.height = source["height"];
	    }
	}
	export class AppPreferences {
	    version: string;
	    name: string;
	    lastTheme: string;
	    lastLanguage: string;
	    lastProject: string;
	    helpCollapsed: boolean;
	    menuCollapsed: boolean;
	    detailCollapsed: boolean;
	    debugCollapsed: boolean;
	    recentProjects: string[];
	    silencedDialogs: Record<string, boolean>;
	    bounds?: Bounds;
	
	    static createFrom(source: any = {}) {
	        return new AppPreferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.name = source["name"];
	        this.lastTheme = source["lastTheme"];
	        this.lastLanguage = source["lastLanguage"];
	        this.lastProject = source["lastProject"];
	        this.helpCollapsed = source["helpCollapsed"];
	        this.menuCollapsed = source["menuCollapsed"];
	        this.detailCollapsed = source["detailCollapsed"];
	        this.debugCollapsed = source["debugCollapsed"];
	        this.recentProjects = source["recentProjects"];
	        this.silencedDialogs = source["silencedDialogs"];
	        this.bounds = this.convertValues(source["bounds"], Bounds);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Chain {
	    chain: string;
	    chainId: number;
	    remoteExplorer: string;
	    rpcProviders: string[];
	    symbol: string;
	
	    static createFrom(source: any = {}) {
	        return new Chain(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chain = source["chain"];
	        this.chainId = source["chainId"];
	        this.remoteExplorer = source["remoteExplorer"];
	        this.rpcProviders = source["rpcProviders"];
	        this.symbol = source["symbol"];
	    }
	}
	export class Id {
	    appName: string;
	    orgName: string;
	    github: string;
	    domain: string;
	    twitter: string;
	
	    static createFrom(source: any = {}) {
	        return new Id(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.appName = source["appName"];
	        this.orgName = source["orgName"];
	        this.github = source["github"];
	        this.domain = source["domain"];
	        this.twitter = source["twitter"];
	    }
	}
	export class OrgPreferences {
	    version?: string;
	    telemetry?: boolean;
	    theme?: string;
	    language?: string;
	    developerName?: string;
	    logLevel?: string;
	    experimental?: boolean;
	    supportUrl?: string;
	
	    static createFrom(source: any = {}) {
	        return new OrgPreferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.telemetry = source["telemetry"];
	        this.theme = source["theme"];
	        this.language = source["language"];
	        this.developerName = source["developerName"];
	        this.logLevel = source["logLevel"];
	        this.experimental = source["experimental"];
	        this.supportUrl = source["supportUrl"];
	    }
	}
	export class UserPreferences {
	    version?: string;
	    name?: string;
	    email?: string;
	    chains?: Chain[];
	
	    static createFrom(source: any = {}) {
	        return new UserPreferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.name = source["name"];
	        this.email = source["email"];
	        this.chains = this.convertValues(source["chains"], Chain);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace project {
	
	export class FilterState {
	    sorting?: Record<string, any>;
	    filtering?: Record<string, any>;
	    other?: Record<string, any>;
	
	    static createFrom(source: any = {}) {
	        return new FilterState(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.sorting = source["sorting"];
	        this.filtering = source["filtering"];
	        this.other = source["other"];
	    }
	}
	export class ViewStateKey {
	    viewName: string;
	    facetName: types.DataFacet;
	
	    static createFrom(source: any = {}) {
	        return new ViewStateKey(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.viewName = source["viewName"];
	        this.facetName = source["facetName"];
	    }
	}
	export class Project {
	    version: string;
	    name: string;
	    last_opened: string;
	    lastView: string;
	    lastFacetMap: Record<string, string>;
	    addresses: base.Address[];
	    activeAddress: base.Address;
	    chains: string[];
	    activeChain: string;
	    contracts: string[];
	    activeContract: string;
	    filterStates: Record<string, FilterState>;
	
	    static createFrom(source: any = {}) {
	        return new Project(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.name = source["name"];
	        this.last_opened = source["last_opened"];
	        this.lastView = source["lastView"];
	        this.lastFacetMap = source["lastFacetMap"];
	        this.addresses = this.convertValues(source["addresses"], base.Address);
	        this.activeAddress = this.convertValues(source["activeAddress"], base.Address);
	        this.chains = source["chains"];
	        this.activeChain = source["activeChain"];
	        this.contracts = source["contracts"];
	        this.activeContract = source["activeContract"];
	        this.filterStates = this.convertValues(source["filterStates"], FilterState, true);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace sdk {
	
	export class SortSpec {
	    fields: string[];
	    orders: boolean[];
	
	    static createFrom(source: any = {}) {
	        return new SortSpec(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fields = source["fields"];
	        this.orders = source["orders"];
	    }
	}

}

export namespace types {
	
	export enum DataFacet {
	    STATEMENTS = "statements",
	    BALANCES = "balances",
	    TRANSFERS = "transfers",
	    TRANSACTIONS = "transactions",
	    WITHDRAWALS = "withdrawals",
	    ASSETS = "assets",
	    LOGS = "logs",
	    TRACES = "traces",
	    RECEIPTS = "receipts",
	}
	export enum LoadState {
	    STALE = "stale",
	    FETCHING = "fetching",
	    PARTIAL = "partial",
	    LOADED = "loaded",
	    PENDING = "pending",
	    ERROR = "error",
	}
	export class Parameter {
	    components?: Parameter[];
	    indexed?: boolean;
	    internalType?: string;
	    name: string;
	    strDefault?: string;
	    type: string;
	    value?: any;
	
	    static createFrom(source: any = {}) {
	        return new Parameter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.components = this.convertValues(source["components"], Parameter);
	        this.indexed = source["indexed"];
	        this.internalType = source["internalType"];
	        this.name = source["name"];
	        this.strDefault = source["strDefault"];
	        this.type = source["type"];
	        this.value = source["value"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Function {
	    anonymous?: boolean;
	    constant?: boolean;
	    encoding: string;
	    inputs: Parameter[];
	    message?: string;
	    name: string;
	    outputs: Parameter[];
	    signature?: string;
	    stateMutability?: string;
	    type: string;
	
	    static createFrom(source: any = {}) {
	        return new Function(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.anonymous = source["anonymous"];
	        this.constant = source["constant"];
	        this.encoding = source["encoding"];
	        this.inputs = this.convertValues(source["inputs"], Parameter);
	        this.message = source["message"];
	        this.name = source["name"];
	        this.outputs = this.convertValues(source["outputs"], Parameter);
	        this.signature = source["signature"];
	        this.stateMutability = source["stateMutability"];
	        this.type = source["type"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Log {
	    address: base.Address;
	    articulatedLog?: Function;
	    blockHash: base.Hash;
	    blockNumber: number;
	    data?: string;
	    logIndex: number;
	    timestamp?: number;
	    topics?: base.Hash[];
	    transactionHash: base.Hash;
	    transactionIndex: number;
	
	    static createFrom(source: any = {}) {
	        return new Log(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.articulatedLog = this.convertValues(source["articulatedLog"], Function);
	        this.blockHash = this.convertValues(source["blockHash"], base.Hash);
	        this.blockNumber = source["blockNumber"];
	        this.data = source["data"];
	        this.logIndex = source["logIndex"];
	        this.timestamp = source["timestamp"];
	        this.topics = this.convertValues(source["topics"], base.Hash);
	        this.transactionHash = this.convertValues(source["transactionHash"], base.Hash);
	        this.transactionIndex = source["transactionIndex"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MetaData {
	    client: number;
	    finalized: number;
	    staging: number;
	    ripe: number;
	    unripe: number;
	    chainId?: number;
	    networkId?: number;
	    chain?: string;
	
	    static createFrom(source: any = {}) {
	        return new MetaData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.client = source["client"];
	        this.finalized = source["finalized"];
	        this.staging = source["staging"];
	        this.ripe = source["ripe"];
	        this.unripe = source["unripe"];
	        this.chainId = source["chainId"];
	        this.networkId = source["networkId"];
	        this.chain = source["chain"];
	    }
	}
	export class Name {
	    address: base.Address;
	    decimals: number;
	    deleted?: boolean;
	    isContract?: boolean;
	    isCustom?: boolean;
	    isErc20?: boolean;
	    isErc721?: boolean;
	    isPrefund?: boolean;
	    name: string;
	    source: string;
	    symbol: string;
	    tags: string;
	    // Go type: base
	    prefund?: any;
	    parts?: number;
	
	    static createFrom(source: any = {}) {
	        return new Name(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.decimals = source["decimals"];
	        this.deleted = source["deleted"];
	        this.isContract = source["isContract"];
	        this.isCustom = source["isCustom"];
	        this.isErc20 = source["isErc20"];
	        this.isErc721 = source["isErc721"];
	        this.isPrefund = source["isPrefund"];
	        this.name = source["name"];
	        this.source = source["source"];
	        this.symbol = source["symbol"];
	        this.tags = source["tags"];
	        this.prefund = this.convertValues(source["prefund"], null);
	        this.parts = source["parts"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Payload {
	    collection: string;
	    dataFacet: DataFacet;
	    chain?: string;
	    address?: string;
	
	    static createFrom(source: any = {}) {
	        return new Payload(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.collection = source["collection"];
	        this.dataFacet = source["dataFacet"];
	        this.chain = source["chain"];
	        this.address = source["address"];
	    }
	}
	export class ProjectPayload {
	    hasProject: boolean;
	    activeChain: string;
	    activeAddress: string;
	    activeContract: string;
	    lastView: string;
	    lastFacetMap: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new ProjectPayload(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hasProject = source["hasProject"];
	        this.activeChain = source["activeChain"];
	        this.activeAddress = source["activeAddress"];
	        this.activeContract = source["activeContract"];
	        this.lastView = source["lastView"];
	        this.lastFacetMap = source["lastFacetMap"];
	    }
	}
	export class Receipt {
	    blockHash?: base.Hash;
	    blockNumber: number;
	    contractAddress?: base.Address;
	    cumulativeGasUsed?: number;
	    effectiveGasPrice?: number;
	    from?: base.Address;
	    gasUsed: number;
	    isError?: boolean;
	    logs: Log[];
	    status: number;
	    to?: base.Address;
	    transactionHash: base.Hash;
	    transactionIndex: number;
	
	    static createFrom(source: any = {}) {
	        return new Receipt(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.blockHash = this.convertValues(source["blockHash"], base.Hash);
	        this.blockNumber = source["blockNumber"];
	        this.contractAddress = this.convertValues(source["contractAddress"], base.Address);
	        this.cumulativeGasUsed = source["cumulativeGasUsed"];
	        this.effectiveGasPrice = source["effectiveGasPrice"];
	        this.from = this.convertValues(source["from"], base.Address);
	        this.gasUsed = source["gasUsed"];
	        this.isError = source["isError"];
	        this.logs = this.convertValues(source["logs"], Log);
	        this.status = source["status"];
	        this.to = this.convertValues(source["to"], base.Address);
	        this.transactionHash = this.convertValues(source["transactionHash"], base.Hash);
	        this.transactionIndex = source["transactionIndex"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Rewards {
	    // Go type: base
	    block: any;
	    // Go type: base
	    nephew: any;
	    // Go type: base
	    txFee: any;
	    // Go type: base
	    uncle: any;
	
	    static createFrom(source: any = {}) {
	        return new Rewards(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.block = this.convertValues(source["block"], null);
	        this.nephew = this.convertValues(source["nephew"], null);
	        this.txFee = this.convertValues(source["txFee"], null);
	        this.uncle = this.convertValues(source["uncle"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Statement {
	    accountedFor: base.Address;
	    // Go type: base
	    amountIn?: any;
	    // Go type: base
	    amountOut?: any;
	    asset: base.Address;
	    // Go type: base
	    begBal: any;
	    blockNumber: number;
	    // Go type: base
	    correctAmountIn?: any;
	    // Go type: base
	    correctAmountOut?: any;
	    // Go type: base
	    correctBegBalIn?: any;
	    // Go type: base
	    correctBegBalOut?: any;
	    // Go type: base
	    correctEndBalIn?: any;
	    // Go type: base
	    correctEndBalOut?: any;
	    correctingReasons?: string;
	    decimals: number;
	    // Go type: base
	    endBal: any;
	    // Go type: base
	    gasOut?: any;
	    // Go type: base
	    internalIn?: any;
	    // Go type: base
	    internalOut?: any;
	    logIndex: number;
	    // Go type: base
	    minerBaseRewardIn?: any;
	    // Go type: base
	    minerNephewRewardIn?: any;
	    // Go type: base
	    minerTxFeeIn?: any;
	    // Go type: base
	    minerUncleRewardIn?: any;
	    // Go type: base
	    prefundIn?: any;
	    // Go type: base
	    prevBal?: any;
	    priceSource: string;
	    recipient: base.Address;
	    // Go type: base
	    selfDestructIn?: any;
	    // Go type: base
	    selfDestructOut?: any;
	    sender: base.Address;
	    // Go type: base
	    spotPrice: any;
	    symbol: string;
	    timestamp: number;
	    transactionHash: base.Hash;
	    transactionIndex: number;
	    correctionId: number;
	    holder: base.Address;
	    statementId: number;
	
	    static createFrom(source: any = {}) {
	        return new Statement(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.accountedFor = this.convertValues(source["accountedFor"], base.Address);
	        this.amountIn = this.convertValues(source["amountIn"], null);
	        this.amountOut = this.convertValues(source["amountOut"], null);
	        this.asset = this.convertValues(source["asset"], base.Address);
	        this.begBal = this.convertValues(source["begBal"], null);
	        this.blockNumber = source["blockNumber"];
	        this.correctAmountIn = this.convertValues(source["correctAmountIn"], null);
	        this.correctAmountOut = this.convertValues(source["correctAmountOut"], null);
	        this.correctBegBalIn = this.convertValues(source["correctBegBalIn"], null);
	        this.correctBegBalOut = this.convertValues(source["correctBegBalOut"], null);
	        this.correctEndBalIn = this.convertValues(source["correctEndBalIn"], null);
	        this.correctEndBalOut = this.convertValues(source["correctEndBalOut"], null);
	        this.correctingReasons = source["correctingReasons"];
	        this.decimals = source["decimals"];
	        this.endBal = this.convertValues(source["endBal"], null);
	        this.gasOut = this.convertValues(source["gasOut"], null);
	        this.internalIn = this.convertValues(source["internalIn"], null);
	        this.internalOut = this.convertValues(source["internalOut"], null);
	        this.logIndex = source["logIndex"];
	        this.minerBaseRewardIn = this.convertValues(source["minerBaseRewardIn"], null);
	        this.minerNephewRewardIn = this.convertValues(source["minerNephewRewardIn"], null);
	        this.minerTxFeeIn = this.convertValues(source["minerTxFeeIn"], null);
	        this.minerUncleRewardIn = this.convertValues(source["minerUncleRewardIn"], null);
	        this.prefundIn = this.convertValues(source["prefundIn"], null);
	        this.prevBal = this.convertValues(source["prevBal"], null);
	        this.priceSource = source["priceSource"];
	        this.recipient = this.convertValues(source["recipient"], base.Address);
	        this.selfDestructIn = this.convertValues(source["selfDestructIn"], null);
	        this.selfDestructOut = this.convertValues(source["selfDestructOut"], null);
	        this.sender = this.convertValues(source["sender"], base.Address);
	        this.spotPrice = this.convertValues(source["spotPrice"], null);
	        this.symbol = source["symbol"];
	        this.timestamp = source["timestamp"];
	        this.transactionHash = this.convertValues(source["transactionHash"], base.Hash);
	        this.transactionIndex = source["transactionIndex"];
	        this.correctionId = source["correctionId"];
	        this.holder = this.convertValues(source["holder"], base.Address);
	        this.statementId = source["statementId"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Summary {
	    totalCount: number;
	    facetCounts: Record<string, number>;
	    customData?: Record<string, any>;
	    lastUpdated: number;
	
	    static createFrom(source: any = {}) {
	        return new Summary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.totalCount = source["totalCount"];
	        this.facetCounts = source["facetCounts"];
	        this.customData = source["customData"];
	        this.lastUpdated = source["lastUpdated"];
	    }
	}
	export class Token {
	    address: base.Address;
	    // Go type: base
	    balance: any;
	    blockNumber: number;
	    decimals: number;
	    holder: base.Address;
	    name: string;
	    // Go type: base
	    priorBalance?: any;
	    symbol: string;
	    timestamp: number;
	    // Go type: base
	    totalSupply: any;
	    transactionIndex?: number;
	    type: number;
	
	    static createFrom(source: any = {}) {
	        return new Token(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.balance = this.convertValues(source["balance"], null);
	        this.blockNumber = source["blockNumber"];
	        this.decimals = source["decimals"];
	        this.holder = this.convertValues(source["holder"], base.Address);
	        this.name = source["name"];
	        this.priorBalance = this.convertValues(source["priorBalance"], null);
	        this.symbol = source["symbol"];
	        this.timestamp = source["timestamp"];
	        this.totalSupply = this.convertValues(source["totalSupply"], null);
	        this.transactionIndex = source["transactionIndex"];
	        this.type = source["type"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TraceResult {
	    address?: base.Address;
	    code?: string;
	    gasUsed?: number;
	    output?: string;
	
	    static createFrom(source: any = {}) {
	        return new TraceResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.code = source["code"];
	        this.gasUsed = source["gasUsed"];
	        this.output = source["output"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TraceAction {
	    address?: base.Address;
	    author?: base.Address;
	    // Go type: base
	    balance?: any;
	    callType: string;
	    from: base.Address;
	    gas: number;
	    init?: string;
	    input?: string;
	    refundAddress?: base.Address;
	    rewardType?: string;
	    selfDestructed?: base.Address;
	    to: base.Address;
	    // Go type: base
	    value: any;
	
	    static createFrom(source: any = {}) {
	        return new TraceAction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.author = this.convertValues(source["author"], base.Address);
	        this.balance = this.convertValues(source["balance"], null);
	        this.callType = source["callType"];
	        this.from = this.convertValues(source["from"], base.Address);
	        this.gas = source["gas"];
	        this.init = source["init"];
	        this.input = source["input"];
	        this.refundAddress = this.convertValues(source["refundAddress"], base.Address);
	        this.rewardType = source["rewardType"];
	        this.selfDestructed = this.convertValues(source["selfDestructed"], base.Address);
	        this.to = this.convertValues(source["to"], base.Address);
	        this.value = this.convertValues(source["value"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Trace {
	    action?: TraceAction;
	    articulatedTrace?: Function;
	    blockHash: base.Hash;
	    blockNumber: number;
	    error?: string;
	    result?: TraceResult;
	    subtraces: number;
	    timestamp: number;
	    traceAddress: number[];
	    transactionHash: base.Hash;
	    transactionIndex: number;
	    type?: string;
	    transactionPosition?: number;
	
	    static createFrom(source: any = {}) {
	        return new Trace(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.action = this.convertValues(source["action"], TraceAction);
	        this.articulatedTrace = this.convertValues(source["articulatedTrace"], Function);
	        this.blockHash = this.convertValues(source["blockHash"], base.Hash);
	        this.blockNumber = source["blockNumber"];
	        this.error = source["error"];
	        this.result = this.convertValues(source["result"], TraceResult);
	        this.subtraces = source["subtraces"];
	        this.timestamp = source["timestamp"];
	        this.traceAddress = source["traceAddress"];
	        this.transactionHash = this.convertValues(source["transactionHash"], base.Hash);
	        this.transactionIndex = source["transactionIndex"];
	        this.type = source["type"];
	        this.transactionPosition = source["transactionPosition"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class Transaction {
	    articulatedTx?: Function;
	    blockHash: base.Hash;
	    blockNumber: number;
	    from: base.Address;
	    gas: number;
	    gasPrice: number;
	    gasUsed: number;
	    hasToken: boolean;
	    hash: base.Hash;
	    input: string;
	    isError: boolean;
	    maxFeePerGas: number;
	    maxPriorityFeePerGas: number;
	    nonce: number;
	    receipt?: Receipt;
	    timestamp: number;
	    to: base.Address;
	    traces: Trace[];
	    transactionIndex: number;
	    type: string;
	    // Go type: base
	    value: any;
	    statements?: Statement[];
	
	    static createFrom(source: any = {}) {
	        return new Transaction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.articulatedTx = this.convertValues(source["articulatedTx"], Function);
	        this.blockHash = this.convertValues(source["blockHash"], base.Hash);
	        this.blockNumber = source["blockNumber"];
	        this.from = this.convertValues(source["from"], base.Address);
	        this.gas = source["gas"];
	        this.gasPrice = source["gasPrice"];
	        this.gasUsed = source["gasUsed"];
	        this.hasToken = source["hasToken"];
	        this.hash = this.convertValues(source["hash"], base.Hash);
	        this.input = source["input"];
	        this.isError = source["isError"];
	        this.maxFeePerGas = source["maxFeePerGas"];
	        this.maxPriorityFeePerGas = source["maxPriorityFeePerGas"];
	        this.nonce = source["nonce"];
	        this.receipt = this.convertValues(source["receipt"], Receipt);
	        this.timestamp = source["timestamp"];
	        this.to = this.convertValues(source["to"], base.Address);
	        this.traces = this.convertValues(source["traces"], Trace);
	        this.transactionIndex = source["transactionIndex"];
	        this.type = source["type"];
	        this.value = this.convertValues(source["value"], null);
	        this.statements = this.convertValues(source["statements"], Statement);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Transfer {
	    // Go type: base
	    amountIn?: any;
	    // Go type: base
	    amountOut?: any;
	    asset: base.Address;
	    blockNumber: number;
	    decimals: number;
	    // Go type: base
	    gasOut?: any;
	    holder: base.Address;
	    // Go type: base
	    internalIn?: any;
	    // Go type: base
	    internalOut?: any;
	    logIndex: number;
	    // Go type: base
	    minerBaseRewardIn?: any;
	    // Go type: base
	    minerNephewRewardIn?: any;
	    // Go type: base
	    minerTxFeeIn?: any;
	    // Go type: base
	    minerUncleRewardIn?: any;
	    // Go type: base
	    prefundIn?: any;
	    recipient: base.Address;
	    // Go type: base
	    selfDestructIn?: any;
	    // Go type: base
	    selfDestructOut?: any;
	    sender: base.Address;
	    transactionIndex: number;
	    log?: Log;
	    transaction?: Transaction;
	
	    static createFrom(source: any = {}) {
	        return new Transfer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.amountIn = this.convertValues(source["amountIn"], null);
	        this.amountOut = this.convertValues(source["amountOut"], null);
	        this.asset = this.convertValues(source["asset"], base.Address);
	        this.blockNumber = source["blockNumber"];
	        this.decimals = source["decimals"];
	        this.gasOut = this.convertValues(source["gasOut"], null);
	        this.holder = this.convertValues(source["holder"], base.Address);
	        this.internalIn = this.convertValues(source["internalIn"], null);
	        this.internalOut = this.convertValues(source["internalOut"], null);
	        this.logIndex = source["logIndex"];
	        this.minerBaseRewardIn = this.convertValues(source["minerBaseRewardIn"], null);
	        this.minerNephewRewardIn = this.convertValues(source["minerNephewRewardIn"], null);
	        this.minerTxFeeIn = this.convertValues(source["minerTxFeeIn"], null);
	        this.minerUncleRewardIn = this.convertValues(source["minerUncleRewardIn"], null);
	        this.prefundIn = this.convertValues(source["prefundIn"], null);
	        this.recipient = this.convertValues(source["recipient"], base.Address);
	        this.selfDestructIn = this.convertValues(source["selfDestructIn"], null);
	        this.selfDestructOut = this.convertValues(source["selfDestructOut"], null);
	        this.sender = this.convertValues(source["sender"], base.Address);
	        this.transactionIndex = source["transactionIndex"];
	        this.log = this.convertValues(source["log"], Log);
	        this.transaction = this.convertValues(source["transaction"], Transaction);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Withdrawal {
	    address: base.Address;
	    // Go type: base
	    amount: any;
	    blockNumber: number;
	    index: number;
	    timestamp: number;
	    validatorIndex: number;
	
	    static createFrom(source: any = {}) {
	        return new Withdrawal(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.amount = this.convertValues(source["amount"], null);
	        this.blockNumber = source["blockNumber"];
	        this.index = source["index"];
	        this.timestamp = source["timestamp"];
	        this.validatorIndex = source["validatorIndex"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace utils {
	
	export class Explorer {
	    name: string;
	    url: string;
	    standard: string;
	
	    static createFrom(source: any = {}) {
	        return new Explorer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.url = source["url"];
	        this.standard = source["standard"];
	    }
	}
	export class NativeCurrency {
	    name: string;
	    symbol: string;
	    decimals: number;
	
	    static createFrom(source: any = {}) {
	        return new NativeCurrency(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.symbol = source["symbol"];
	        this.decimals = source["decimals"];
	    }
	}
	export class ChainListItem {
	    name: string;
	    chain: string;
	    icon: string;
	    rpc: string[];
	    faucets: string[];
	    nativeCurrency: NativeCurrency;
	    infoURL: string;
	    shortName: string;
	    chainId: number;
	    networkId: number;
	    explorers: Explorer[];
	
	    static createFrom(source: any = {}) {
	        return new ChainListItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.chain = source["chain"];
	        this.icon = source["icon"];
	        this.rpc = source["rpc"];
	        this.faucets = source["faucets"];
	        this.nativeCurrency = this.convertValues(source["nativeCurrency"], NativeCurrency);
	        this.infoURL = source["infoURL"];
	        this.shortName = source["shortName"];
	        this.chainId = source["chainId"];
	        this.networkId = source["networkId"];
	        this.explorers = this.convertValues(source["explorers"], Explorer);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ChainList {
	    chains: ChainListItem[];
	    ChainsMap: Record<number, ChainListItem>;
	
	    static createFrom(source: any = {}) {
	        return new ChainList(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chains = this.convertValues(source["chains"], ChainListItem);
	        this.ChainsMap = this.convertValues(source["ChainsMap"], ChainListItem, true);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	

}

